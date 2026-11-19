/**
 * Conversational AI Chat Gateway API (Phase 6)
 *
 * Orchestrates multi-turn agentic RAG between the Kosera web client, the remote
 * GPU LLM inference server (Qwen2.5-7B-Instruct + QLoRA), and live local
 * PostgreSQL + pgvector tools (`semanticSearch`, `getHybridRecommendations`).
 *
 * @module app/api/chat
 */

import { z } from 'zod';
import { serverAuth } from '@/lib/server-auth';
import { ok, fail } from '@/types/api';
import {
  executeChatTool,
  formatSSE,
  getLLMServiceUrl,
  streamLLMChat,
  type ChatKosCard,
  type ChatMessage,
  type ChatToolCall,
} from '@/lib/ai/chat';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const MAX_TOOL_ROUNDS = 2;

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1, 'Message content cannot be empty').max(4000),
      })
    )
    .min(1, 'At least one message is required')
    .max(20, 'Maximum 20 messages per request'),
  stream: z.boolean().optional().default(true),
  maxNewTokens: z.number().int().min(64).max(1536).optional().default(768),
});

const getToolStatusMessage = (toolName: string): string => {
  if (toolName === 'getHybridRecommendations') {
    return 'Menghitung peringkat SPK Hybrid (Profile Matching + AI Semantic)...';
  }
  if (toolName === 'semanticSearch') {
    return 'Mencari kos yang sesuai di database Kosera...';
  }
  return `Menjalankan tool ${toolName}...`;
};

/**
 * Run the agentic chat loop (LLM -> optional local DB tool execution -> grounded LLM answer).
 */
async function runAgenticChat(params: {
  initialMessages: ChatMessage[];
  userId: number | null;
  maxNewTokens: number;
  signal?: AbortSignal;
  onEvent?: (event: string, data: unknown) => void;
}): Promise<{ content: string; cards: ChatKosCard[]; toolsUsed: string[] }> {
  const { initialMessages, userId, maxNewTokens, signal, onEvent } = params;
  const conversation: ChatMessage[] = [...initialMessages];
  const allCards: ChatKosCard[] = [];
  const seenKosIds = new Set<number>();
  const toolsUsed: string[] = [];
  let finalText = '';

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    if (round === 0) {
      onEvent?.('status', { stage: 'thinking', message: 'Memproses pertanyaan...' });
    } else {
      onEvent?.('status', {
        stage: 'generating',
        message: 'Menyusun rekomendasi berdasarkan data Kosera...',
      });
    }

    let roundText = '';
    let pendingToolCalls: ChatToolCall[] = [];

    for await (const evt of streamLLMChat(conversation, {
      maxNewTokens,
      temperature: 0.0,
      signal,
    })) {
      if (evt.event === 'token') {
        roundText += evt.data.delta;
        onEvent?.('token', { delta: evt.data.delta });
      } else if (evt.event === 'tool_call') {
        pendingToolCalls = evt.data.tool_calls;
      } else if (evt.event === 'error') {
        throw new Error(evt.data.detail);
      } else if (evt.event === 'done' && evt.data.content && !roundText) {
        roundText = evt.data.content;
      }
    }

    // If the model emitted no tool calls (or we reached the tool-round cap), we are done.
    if (pendingToolCalls.length === 0 || round === MAX_TOOL_ROUNDS) {
      finalText = roundText.trim();
      break;
    }

    // Append assistant tool-call turn in exact Qwen2.5 format (arguments as dict).
    conversation.push({
      role: 'assistant',
      content: '',
      tool_calls: pendingToolCalls,
    });

    // Execute every requested tool live against local PostgreSQL + pgvector.
    for (const tc of pendingToolCalls) {
      const toolName = tc.function.name;
      toolsUsed.push(toolName);
      onEvent?.('status', {
        stage: 'searching',
        tool: toolName,
        message: getToolStatusMessage(toolName),
      });

      const toolResult = await executeChatTool(tc, userId);

      const newCards: ChatKosCard[] = [];
      for (const card of toolResult.cards) {
        if (!seenKosIds.has(card.kosId)) {
          seenKosIds.add(card.kosId);
          allCards.push(card);
          newCards.push(card);
        }
      }

      if (newCards.length > 0) {
        onEvent?.('cards', {
          tool: toolName,
          cards: newCards,
          total: toolResult.total,
        });
      }

      conversation.push({
        role: 'tool',
        name: toolName,
        content: JSON.stringify(toolResult.llmPayload),
      });
    }
  }

  return {
    content: finalText,
    cards: allCards,
    toolsUsed,
  };
}

/**
 * POST /api/chat
 *
 * Accepts conversation messages and streams grounded Kosera SPK responses over SSE
 * (or returns JSON when `stream: false`).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return fail(
      'validation_error',
      'Invalid chat request payload',
      parsed.error.flatten(),
      { status: 400 }
    );
  }

  if (!getLLMServiceUrl()) {
    return fail(
      'ai_service_unavailable',
      'Layanan AI Chat belum terhubung (LLM_SERVICE_URL belum dikonfigurasi).',
      undefined,
      { status: 503 }
    );
  }

  // Optional authentication: logged-in users get personalized SPK preferences,
  // while guests can still use semanticSearch and default SPK recommendations.
  const auth = serverAuth(request);
  const userId = auth.isAuthenticated && auth.user ? auth.user.userId : null;

  const initialMessages: ChatMessage[] = parsed.data.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  if (!parsed.data.stream) {
    try {
      const result = await runAgenticChat({
        initialMessages,
        userId,
        maxNewTokens: parsed.data.maxNewTokens,
        signal: request.signal,
      });

      return ok('Chat completed', {
        message: result.content,
        cards: result.cards,
        toolsUsed: result.toolsUsed,
      });
    } catch (error) {
      console.error('[api/chat] Non-streaming error:', error);
      return fail(
        'ai_service_unavailable',
        error instanceof Error ? error.message : 'Gagal menghubungi layanan AI Chat',
        undefined,
        { status: 502 }
      );
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(formatSSE(event, data)));
        } catch {
          // Client disconnected
        }
      };

      try {
        const result = await runAgenticChat({
          initialMessages,
          userId,
          maxNewTokens: parsed.data.maxNewTokens,
          signal: request.signal,
          onEvent: push,
        });

        push('done', {
          content: result.content,
          cards: result.cards,
          toolsUsed: result.toolsUsed,
        });
      } catch (error) {
        console.error('[api/chat] Streaming error:', error);
        push('error', {
          detail:
            error instanceof Error
              ? error.message
              : 'Terjadi gangguan saat menghubungi layanan AI Chat.',
        });
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
