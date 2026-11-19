/**
 * Client-safe types and SSE frame parser for Kosera SPK Conversational Chat.
 *
 * Kept free of database or Node-only imports so both Server Routes and Client
 * Components can share identical types and SSE parsing logic.
 *
 * @module lib/ai/chat-types
 */

export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatToolCall {
  id?: string;
  type: 'function';
  function: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  name?: string;
  tool_calls?: ChatToolCall[];
}

export interface ChatKosCard {
  kosId: number;
  postId: number;
  title: string;
  city: string;
  subdistrict: string | null;
  gender: string | null;
  priceMonthly: number;
  availableRooms: number;
  rating: number | null;
  facilities: string[];
  imageUrl: string | null;
  similarityScore?: number;
  profileMatchingScore?: number;
  hybridScore?: number;
  rank?: number;
}

export interface LLMHealthResponse {
  status: 'online' | 'offline' | 'unconfigured';
  model: string | null;
  adapter: string | null;
  device: string | null;
  dtype: string | null;
}

export const parseSSEFrames = (
  buffer: string
): { events: Array<{ event: string; data: string }>; remaining: string } => {
  const normalized = buffer.replace(/\r\n/g, '\n');
  const blocks = normalized.split('\n\n');
  const remaining = blocks.pop() ?? '';
  const events: Array<{ event: string; data: string }> = [];

  for (const block of blocks) {
    if (!block.trim()) continue;
    let eventName = 'message';
    const dataLines: string[] = [];

    for (const line of block.split('\n')) {
      if (line.startsWith(':')) continue;
      if (line.startsWith('event:')) {
        eventName = line.slice('event:'.length).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice('data:'.length).trim());
      }
    }

    if (dataLines.length > 0) {
      events.push({ event: eventName, data: dataLines.join('\n') });
    }
  }

  return { events, remaining };
};
