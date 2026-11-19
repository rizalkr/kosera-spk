/**
 * Kosera SPK Conversational RAG & LLM Gateway Helpers
 *
 * Bridges Next.js server routes with the remote GPU LLM inference server
 * (Qwen2.5-7B-Instruct + QLoRA served via standard HF transformers + PEFT)
 * while executing all kos retrieval tools live against local PostgreSQL + pgvector.
 *
 * @module lib/ai/chat
 */

import { db } from '@/db';
import { kosPhotos, posts } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { semanticSearch } from './search';
import { getHybridRecommendations } from './hybrid';
import { toUnitScore } from './hybrid-scoring';
import {
  parseSSEFrames,
  type ChatRole,
  type ChatToolCall,
  type ChatMessage,
  type ChatKosCard,
  type LLMHealthResponse,
} from './chat-types';

export {
  parseSSEFrames,
  type ChatRole,
  type ChatToolCall,
  type ChatMessage,
  type ChatKosCard,
  type LLMHealthResponse,
};

// =============================================================================
// Server-Only Types
// =============================================================================

export interface ToolExecutionResult {
  toolName: string;
  llmPayload: Record<string, unknown>;
  cards: ChatKosCard[];
  total: number;
}

export type RemoteLLMEvent =
  | { event: 'token'; data: { delta: string } }
  | { event: 'tool_call'; data: { tool_calls: ChatToolCall[]; raw_output?: string } }
  | { event: 'done'; data: { finish_reason: string; content?: string; latency_sec?: number } }
  | { event: 'error'; data: { detail: string } };

// =============================================================================
// Configuration Helpers
// =============================================================================

const TOOL_CALL_REGEX = /<tool_call>\s*(\{[\s\S]*?\})\s*<\/tool_call>/g;
const MAX_TOOL_LIMIT = 10;
const DEFAULT_TOOL_LIMIT = 5;

export const getLLMServiceUrl = (): string => {
  return (process.env.LLM_SERVICE_URL || '').trim().replace(/\/+$/, '');
};

export const getLLMApiKey = (): string => {
  return (process.env.LLM_API_KEY || process.env.AI_API_KEY || '').trim();
};

const buildLLMHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream, application/json',
  };
  const apiKey = getLLMApiKey();
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  return headers;
};

// =============================================================================
// Pure Parsing & Formatting Utilities
// =============================================================================

export const formatSSE = (event: string, data: unknown): string => {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
};

export const parseFacilitiesList = (raw: string | null | undefined, maxItems = 10): string[] => {
  if (!raw) return [];
  return raw
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
};

export const parseToolCalls = (rawText: string): ChatToolCall[] => {
  if (!rawText) return [];
  const calls: ChatToolCall[] = [];
  const matches = rawText.matchAll(TOOL_CALL_REGEX);

  for (const match of matches) {
    try {
      const payload = JSON.parse(match[1]) as {
        name?: unknown;
        arguments?: unknown;
      };
      if (typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        continue;
      }

      let args: Record<string, unknown> = {};
      if (typeof payload.arguments === 'string') {
        try {
          const parsedArgs = JSON.parse(payload.arguments) as unknown;
          if (parsedArgs && typeof parsedArgs === 'object' && !Array.isArray(parsedArgs)) {
            args = parsedArgs as Record<string, unknown>;
          }
        } catch {
          args = {};
        }
      } else if (
        payload.arguments &&
        typeof payload.arguments === 'object' &&
        !Array.isArray(payload.arguments)
      ) {
        args = payload.arguments as Record<string, unknown>;
      }

      calls.push({
        type: 'function',
        function: {
          name: payload.name.trim(),
          arguments: args,
        },
      });
    } catch {
      // Ignore malformed JSON blocks
    }
  }

  return calls;
};

const toOptionalPositiveInt = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.round(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.round(parsed);
    }
  }
  return undefined;
};

const toOptionalWeight = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed;
    }
  }
  return undefined;
};

const toOptionalGender = (value: unknown): 'putra' | 'putri' | 'campur' | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'putra' || normalized === 'putri' || normalized === 'campur') {
    return normalized;
  }
  return undefined;
};

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toOptionalStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const cleaned = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const cleaned = parseFacilitiesList(value, 10);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  return undefined;
};

// =============================================================================
// Live Database Tool Execution
// =============================================================================

const fetchMetadataForKos = async (
  kosIds: number[],
  postIds: number[]
): Promise<{
  primaryPhotoByKosId: Map<number, string>;
  ratingByPostId: Map<number, number>;
}> => {
  const primaryPhotoByKosId = new Map<number, string>();
  const ratingByPostId = new Map<number, number>();

  if (kosIds.length === 0) {
    return { primaryPhotoByKosId, ratingByPostId };
  }

  try {
    const [photos, postRows] = await Promise.all([
      db
        .select({
          kosId: kosPhotos.kosId,
          url: kosPhotos.url,
          isPrimary: kosPhotos.isPrimary,
        })
        .from(kosPhotos)
        .where(inArray(kosPhotos.kosId, kosIds)),
      postIds.length > 0
        ? db
            .select({
              id: posts.id,
              averageRating: posts.averageRating,
            })
            .from(posts)
            .where(inArray(posts.id, postIds))
        : Promise.resolve([]),
    ]);

    for (const photo of photos) {
      if (photo.isPrimary || !primaryPhotoByKosId.has(photo.kosId)) {
        primaryPhotoByKosId.set(photo.kosId, photo.url);
      }
    }

    for (const row of postRows) {
      const parsed = Number(row.averageRating);
      if (Number.isFinite(parsed)) {
        ratingByPostId.set(row.id, parsed);
      }
    }
  } catch (error) {
    console.warn('[chat-tool] Optional photo/rating enrichment failed:', error);
  }

  return { primaryPhotoByKosId, ratingByPostId };
};

export const executeChatTool = async (
  toolCall: ChatToolCall,
  userId: number | null
): Promise<ToolExecutionResult> => {
  const toolName = toolCall.function.name;
  const args = toolCall.function.arguments || {};

  if (toolName === 'semanticSearch') {
    const city = toOptionalString(args.city);
    const subdistrict = toOptionalString(args.subdistrict);
    const gender = toOptionalGender(args.gender);
    const minPrice = toOptionalPositiveInt(args.minPrice);
    const maxPrice = toOptionalPositiveInt(args.maxPrice);
    const minRooms = toOptionalPositiveInt(args.minRooms);
    const facilities = toOptionalStringArray(args.facilities);
    const requestedLimit = toOptionalPositiveInt(args.limit) ?? DEFAULT_TOOL_LIMIT;
    const limit = Math.max(1, Math.min(MAX_TOOL_LIMIT, requestedLimit));

    const fallbackQueryParts = [
      gender ? `kos ${gender}` : 'kos',
      subdistrict,
      city,
      facilities?.join(' '),
    ].filter(Boolean);
    const query = toOptionalString(args.query) || fallbackQueryParts.join(' ');

    const searchResp = await semanticSearch(
      query,
      { city, subdistrict, gender, minPrice, maxPrice, minRooms, facilities },
      limit
    );

    const kosIds = searchResp.results.map((r) => r.id);
    const postIds = searchResp.results.map((r) => r.postId);
    const { primaryPhotoByKosId, ratingByPostId } = await fetchMetadataForKos(kosIds, postIds);

    const cards: ChatKosCard[] = searchResp.results.map((r) => {
      const parsedFacilities = parseFacilitiesList(r.facilities, 8);
      const rating = ratingByPostId.get(r.postId) ?? null;
      return {
        kosId: r.id,
        postId: r.postId,
        title: r.name || r.title,
        city: r.city,
        subdistrict: r.subdistrict,
        gender: r.gender,
        priceMonthly: r.price,
        availableRooms: r.availableRooms,
        rating,
        facilities: parsedFacilities,
        imageUrl: primaryPhotoByKosId.get(r.id) ?? null,
        similarityScore: Number(r.similarityScore.toFixed(4)),
      };
    });

    // Match the exact SFT `<tool_response>` JSON structure used in Phase 3-5
    const llmResults = searchResp.results.map((r) => ({
      kosId: r.id,
      title: r.name || r.title,
      city: r.city,
      subdistrict: r.subdistrict,
      gender: r.gender,
      priceMonthly: r.price,
      availableRooms: r.availableRooms,
      roomSize: r.roomSize,
      rating: ratingByPostId.get(r.postId) ?? 0,
      facilities: parseFacilitiesList(r.facilities, 8),
      similarityScore: Number(r.similarityScore.toFixed(4)),
    }));

    return {
      toolName,
      llmPayload: {
        results: llmResults,
        total: llmResults.length,
        searchType: searchResp.searchType,
      },
      cards,
      total: llmResults.length,
    };
  }

  if (toolName === 'getHybridRecommendations') {
    const query = toOptionalString(args.query);
    const weightPM = toOptionalWeight(args.weightPM) ?? 0.7;
    const weightAI = toOptionalWeight(args.weightAI) ?? 0.3;
    const requestedLimit = toOptionalPositiveInt(args.limit) ?? DEFAULT_TOOL_LIMIT;
    const limit = Math.max(1, Math.min(MAX_TOOL_LIMIT, requestedLimit));

    const effectiveUserId = userId ?? 0;
    const hybridResp = await getHybridRecommendations(effectiveUserId, {
      query,
      weightPM,
      weightAI,
      page: 1,
      limit,
    });

    const cards: ChatKosCard[] = hybridResp.recommendations.map((rec, index) => {
      const primaryPhoto =
        rec.photos.find((p) => p.isPrimary)?.url ?? rec.photos[0]?.url ?? null;
      const parsedRating = Number(rec.averageRating);
      return {
        rank: index + 1,
        kosId: rec.id,
        postId: rec.postId,
        title: rec.name || rec.title,
        city: rec.city,
        subdistrict: null,
        gender: null,
        priceMonthly: rec.price,
        availableRooms: rec.availableRooms,
        rating: Number.isFinite(parsedRating) ? parsedRating : null,
        facilities: parseFacilitiesList(rec.facilities, 8),
        imageUrl: primaryPhoto,
        // UI cards: PM and hybrid on 0-100, similarity on 0-1 (same as semanticSearch cards)
        profileMatchingScore: rec.hybridDetails.profileMatchingScore,
        similarityScore: toUnitScore(rec.hybridDetails.semanticSimilarityScore),
        hybridScore: rec.hybridScore,
      };
    });

    // LLM payload: all scores on the 0-1 scale used by the SFT v1 <tool_response> schema
    const llmResults = hybridResp.recommendations.map((rec, index) => {
      const parsedRating = Number(rec.averageRating);
      return {
        rank: index + 1,
        kosId: rec.id,
        title: rec.name || rec.title,
        city: rec.city,
        priceMonthly: rec.price,
        availableRooms: rec.availableRooms,
        rating: Number.isFinite(parsedRating) ? parsedRating : 0,
        facilities: parseFacilitiesList(rec.facilities, 8),
        profileMatchingScore: toUnitScore(rec.hybridDetails.profileMatchingScore),
        semanticScore: toUnitScore(rec.hybridDetails.semanticSimilarityScore),
        hybridScore: toUnitScore(rec.hybridScore),
      };
    });

    const normalizedTotalWeight = weightPM + weightAI || 1;
    return {
      toolName,
      llmPayload: {
        results: llmResults,
        total: llmResults.length,
        algorithmMode: hybridResp.algorithmMode,
        personalized: Boolean(userId && hybridResp.userPreferences),
        weights: {
          weightPM: Number((weightPM / normalizedTotalWeight).toFixed(2)),
          weightAI: Number((weightAI / normalizedTotalWeight).toFixed(2)),
        },
      },
      cards,
      total: llmResults.length,
    };
  }

  return {
    toolName,
    llmPayload: {
      error: `Unsupported tool: ${toolName}`,
      results: [],
      total: 0,
    },
    cards: [],
    total: 0,
  };
};

// =============================================================================
// Remote GPU LLM HTTP / SSE Client
// =============================================================================

export const checkLLMHealth = async (): Promise<LLMHealthResponse> => {
  const baseUrl = getLLMServiceUrl();
  if (!baseUrl) {
    return {
      status: 'unconfigured',
      model: null,
      adapter: null,
      device: null,
      dtype: null,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        status: 'offline',
        model: null,
        adapter: null,
        device: null,
        dtype: null,
      };
    }

    const data = (await response.json()) as {
      status?: string;
      model?: string;
      adapter?: string | null;
      device?: string | null;
      dtype?: string | null;
    };

    return {
      status: data.status === 'ok' ? 'online' : 'offline',
      model: data.model ?? null,
      adapter: data.adapter ?? null,
      device: data.device ?? null,
      dtype: data.dtype ?? null,
    };
  } catch {
    return {
      status: 'offline',
      model: null,
      adapter: null,
      device: null,
      dtype: null,
    };
  }
};

export async function* streamLLMChat(
  messages: ChatMessage[],
  options: { maxNewTokens?: number; temperature?: number; signal?: AbortSignal } = {}
): AsyncGenerator<RemoteLLMEvent, void, unknown> {
  const baseUrl = getLLMServiceUrl();
  if (!baseUrl) {
    throw new Error('LLM_SERVICE_URL is not configured');
  }

  const response = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: buildLLMHeaders(),
    body: JSON.stringify({
      messages,
      stream: true,
      max_new_tokens: options.maxNewTokens ?? 768,
      temperature: options.temperature ?? 0.0,
    }),
    signal: options.signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    const detailText = await response.text().catch(() => '');
    throw new Error(`LLM service error (${response.status}): ${detailText.slice(0, 300)}`);
  }

  if (!response.body) {
    throw new Error('LLM service returned an empty stream body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const { events, remaining } = parseSSEFrames(buffer);
      buffer = remaining;

      for (const evt of events) {
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(evt.data) as Record<string, unknown>;
        } catch {
          continue;
        }

        if (evt.event === 'token' && typeof parsed.delta === 'string') {
          yield { event: 'token', data: { delta: parsed.delta } };
        } else if (evt.event === 'tool_call' && Array.isArray(parsed.tool_calls)) {
          yield {
            event: 'tool_call',
            data: {
              tool_calls: parsed.tool_calls as ChatToolCall[],
              raw_output: typeof parsed.raw_output === 'string' ? parsed.raw_output : undefined,
            },
          };
        } else if (evt.event === 'done') {
          yield {
            event: 'done',
            data: {
              finish_reason:
                typeof parsed.finish_reason === 'string' ? parsed.finish_reason : 'stop',
              content: typeof parsed.content === 'string' ? parsed.content : undefined,
              latency_sec:
                typeof parsed.latency_sec === 'number' ? parsed.latency_sec : undefined,
            },
          };
        } else if (evt.event === 'error') {
          yield {
            event: 'error',
            data: {
              detail:
                typeof parsed.detail === 'string' ? parsed.detail : 'Unknown LLM stream error',
            },
          };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
