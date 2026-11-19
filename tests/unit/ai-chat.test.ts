/**
 * Conversational AI Chat & Agentic Gateway Unit Tests (Phase 6)
 *
 * Tests Qwen2.5 tool-call parsing, SSE frame parsing/formatting, tool execution
 * payload alignment, and the POST /api/chat agentic loop without requiring live
 * PostgreSQL or GPU network calls.
 *
 * @module tests/unit/ai-chat.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const {
  mockSemanticSearch,
  mockGetHybridRecommendations,
  mockInsertValues,
  mockInsertReturning,
} = vi.hoisted(() => ({
  mockSemanticSearch: vi.fn(),
  mockGetHybridRecommendations: vi.fn(),
  mockInsertValues: vi.fn(),
  mockInsertReturning: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: () => ({
      values: (vals: unknown) => {
        mockInsertValues(vals);
        return {
          returning: () => mockInsertReturning(),
        };
      },
    }),
  },
}));

vi.mock('@/lib/ai/search', () => ({
  semanticSearch: (...args: unknown[]) => mockSemanticSearch(...args),
}));

vi.mock('@/lib/ai/hybrid', () => ({
  getHybridRecommendations: (...args: unknown[]) => mockGetHybridRecommendations(...args),
}));

import {
  executeChatTool,
  formatSSE,
  getLLMProvider,
  parseFacilitiesList,
  parseSSEFrames,
  parseToolCalls,
} from '@/lib/ai/chat';
import { POST as chatPost } from '@/app/api/chat/route';
import { POST as feedbackPost } from '@/app/api/chat/feedback/route';
import {
  computeAnonymizedSessionHash,
  resetFeedbackRateLimiter,
} from '@/lib/ai/chat-feedback';
import { sanitizeStreamingMarkdown } from '@/components/features/chat/ChatMarkdown';

function makeMockSSEResponse(frames: Array<{ event: string; data: unknown }>): Response {
  const payload = frames.map((f) => formatSSE(f.event, f.data)).join('');
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(payload));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

function makeMockOpenAISSEResponse(chunks: Array<Record<string, unknown> | '[DONE]'>): Response {
  const payload = chunks
    .map((chunk) =>
      chunk === '[DONE]' ? 'data: [DONE]\n\n' : `data: ${JSON.stringify(chunk)}\n\n`
    )
    .join('');
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(payload));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('AI Chat Helpers', () => {
  describe('parseToolCalls', () => {
    it('extracts Qwen2.5 <tool_call> JSON blocks into structured tool calls', () => {
      const raw = `<tool_call>\n{"name": "semanticSearch", "arguments": {"query": "kos putri sleman", "city": "Sleman", "gender": "putri", "maxPrice": 1500000}}\n</tool_call>`;
      const calls = parseToolCalls(raw);

      expect(calls).toHaveLength(1);
      expect(calls[0].function.name).toBe('semanticSearch');
      expect(calls[0].function.arguments).toEqual({
        query: 'kos putri sleman',
        city: 'Sleman',
        gender: 'putri',
        maxPrice: 1500000,
      });
    });

    it('parses stringified arguments safely and ignores malformed blocks', () => {
      const raw = [
        '<tool_call>not valid json</tool_call>',
        '<tool_call>{"name": "getHybridRecommendations", "arguments": "{\\"weightPM\\": 0.7, \\"weightAI\\": 0.3}"}</tool_call>',
      ].join('\n');

      const calls = parseToolCalls(raw);
      expect(calls).toHaveLength(1);
      expect(calls[0].function.name).toBe('getHybridRecommendations');
      expect(calls[0].function.arguments).toEqual({ weightPM: 0.7, weightAI: 0.3 });
    });
  });

  describe('parseFacilitiesList', () => {
    it('splits, trims, and caps facilities list', () => {
      expect(parseFacilitiesList('AC, WiFi; K. Mandi Dalam\nParkir Motor', 3)).toEqual([
        'AC',
        'WiFi',
        'K. Mandi Dalam',
      ]);
      expect(parseFacilitiesList(null)).toEqual([]);
    });
  });

  describe('sanitizeStreamingMarkdown', () => {
    it('strips dangling unclosed bold asterisks during live streaming only', () => {
      expect(sanitizeStreamingMarkdown('1. **Kost Rahayu**', true)).toBe('1. **Kost Rahayu**');
      expect(sanitizeStreamingMarkdown('1. **', true)).toBe('1. ');
      expect(sanitizeStreamingMarkdown('1. **', false)).toBe('1. **');
    });
  });

  describe('parseSSEFrames', () => {
    it('parses complete SSE events and preserves incomplete trailing chunk', () => {
      const chunk =
        'event: status\ndata: {"stage":"thinking"}\n\n' +
        'event: token\ndata: {"delta":"Halo"}\n\n' +
        'event: token\ndata: {"delta":" par';

      const { events, remaining } = parseSSEFrames(chunk);
      expect(events).toHaveLength(2);
      expect(events[0]).toEqual({ event: 'status', data: '{"stage":"thinking"}' });
      expect(events[1]).toEqual({ event: 'token', data: '{"delta":"Halo"}' });
      expect(remaining).toBe('event: token\ndata: {"delta":" par');
    });
  });

  describe('executeChatTool', () => {
    beforeEach(() => {
      mockSemanticSearch.mockReset();
      mockGetHybridRecommendations.mockReset();
    });

    it('formats semanticSearch results to match the SFT tool_response schema', async () => {
      mockSemanticSearch.mockResolvedValueOnce({
        query: 'kos putri sleman',
        searchType: 'semantic',
        total: 1,
        results: [
          {
            id: 42,
            postId: 101,
            name: 'Kost Melati Sleman',
            title: 'Kost Melati Sleman',
            city: 'Sleman',
            subdistrict: 'Depok',
            gender: 'putri',
            roomSize: '3x4',
            facilities: 'AC, WiFi, K. Mandi Dalam',
            price: 1200000,
            totalRooms: 10,
            occupiedRooms: 7,
            availableRooms: 3,
            similarityScore: 0.87654,
          },
        ],
      });

      const res = await executeChatTool(
        {
          type: 'function',
          function: {
            name: 'semanticSearch',
            arguments: {
              query: 'kos putri sleman',
              city: 'Sleman',
              gender: 'putri',
              maxPrice: 1500000,
              limit: 3,
            },
          },
        },
        null
      );

      expect(mockSemanticSearch).toHaveBeenCalledWith(
        'kos putri sleman',
        expect.objectContaining({ city: 'Sleman', gender: 'putri', maxPrice: 1500000 }),
        3
      );
      expect(res.total).toBe(1);
      expect(res.cards).toHaveLength(1);
      expect(res.cards[0].kosId).toBe(42);
      expect(res.cards[0].priceMonthly).toBe(1200000);
      expect(res.llmPayload).toMatchObject({
        total: 1,
        searchType: 'semantic',
      });
    });

    it('executes getHybridRecommendations for authenticated or guest user', async () => {
      mockGetHybridRecommendations.mockResolvedValueOnce({
        algorithmMode: 'hybrid',
        userPreferences: null,
        query: 'dekat kampus',
        pagination: { page: 1, limit: 3, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
        recommendations: [
          {
            id: 77,
            postId: 202,
            name: 'Kost Anggrek UGM',
            title: 'Kost Anggrek UGM',
            city: 'Sleman',
            price: 1100000,
            availableRooms: 2,
            averageRating: '4.7',
            facilities: 'WiFi, AC',
            photos: [{ id: 1, url: '/images/mamikos/77.jpg', isPrimary: true }],
            hybridScore: 88,
            hybridDetails: {
              profileMatchingScore: 90,
              semanticSimilarityScore: 84,
              weightPM: 0.7,
              weightAI: 0.3,
            },
          },
        ],
      });

      const res = await executeChatTool(
        {
          type: 'function',
          function: {
            name: 'getHybridRecommendations',
            arguments: { query: 'dekat kampus', weightPM: 0.7, weightAI: 0.3, limit: 3 },
          },
        },
        null
      );

      expect(mockGetHybridRecommendations).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ query: 'dekat kampus', weightPM: 0.7, weightAI: 0.3, limit: 3 })
      );
      expect(res.cards[0]).toMatchObject({
        rank: 1,
        kosId: 77,
        hybridScore: 88,
        profileMatchingScore: 90,
        similarityScore: 0.84,
        imageUrl: '/images/mamikos/77.jpg',
      });

      // LLM payload uses the SFT v1 0-1 score scale
      const payload = res.llmPayload as {
        results: Array<{ profileMatchingScore: number; semanticScore: number; hybridScore: number }>;
        weights: { weightPM: number; weightAI: number };
      };
      expect(payload.results[0]).toMatchObject({
        profileMatchingScore: 0.9,
        semanticScore: 0.84,
        hybridScore: 0.88,
      });
      expect(payload.weights).toEqual({ weightPM: 0.7, weightAI: 0.3 });
    });
  });
});

describe('POST /api/chat route', () => {
  const originalUrl = process.env.LLM_SERVICE_URL;
  const originalKey = process.env.LLM_API_KEY;
  const originalProvider = process.env.LLM_PROVIDER;
  const originalModelName = process.env.LLM_MODEL_NAME;
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockSemanticSearch.mockReset();
    mockGetHybridRecommendations.mockReset();
    delete process.env.LLM_PROVIDER;
    delete process.env.LLM_MODEL_NAME;
  });

  afterEach(() => {
    if (originalUrl === undefined) delete process.env.LLM_SERVICE_URL;
    else process.env.LLM_SERVICE_URL = originalUrl;

    if (originalKey === undefined) delete process.env.LLM_API_KEY;
    else process.env.LLM_API_KEY = originalKey;

    if (originalProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = originalProvider;

    if (originalModelName === undefined) delete process.env.LLM_MODEL_NAME;
    else process.env.LLM_MODEL_NAME = originalModelName;

    global.fetch = originalFetch;
  });

  it('returns 400 for invalid empty messages payload', async () => {
    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [] }),
    });

    const resp = await chatPost(req);
    expect(resp.status).toBe(400);
  });

  it('returns 503 when LLM_SERVICE_URL is not configured', async () => {
    delete process.env.LLM_SERVICE_URL;
    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Cari kos putri di Sleman' }],
      }),
    });

    const resp = await chatPost(req);
    expect(resp.status).toBe(503);
    const body = (await resp.json()) as { success?: boolean; error?: string };
    expect(body.success).toBe(false);
    expect(body.error).toBe('ai_service_unavailable');
  });

  it('runs a 2-round tool call loop and streams cards + tokens over SSE', async () => {
    process.env.LLM_SERVICE_URL = 'https://mock-colab.trycloudflare.com';
    process.env.LLM_API_KEY = 'test-secret-key';

    mockSemanticSearch.mockResolvedValueOnce({
      query: 'kos putri sleman',
      searchType: 'semantic',
      total: 1,
      results: [
        {
          id: 55,
          postId: 155,
          name: 'Kost Kenanga Sleman',
          title: 'Kost Kenanga Sleman',
          city: 'Sleman',
          subdistrict: 'Depok',
          gender: 'putri',
          roomSize: '3x3',
          facilities: 'AC, WiFi',
          price: 1250000,
          totalRooms: 8,
          occupiedRooms: 5,
          availableRooms: 3,
          similarityScore: 0.91,
        },
      ],
    });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        makeMockSSEResponse([
          {
            event: 'tool_call',
            data: {
              tool_calls: [
                {
                  id: 'call_1',
                  type: 'function',
                  function: {
                    name: 'semanticSearch',
                    arguments: { query: 'kos putri sleman', city: 'Sleman', gender: 'putri' },
                  },
                },
              ],
            },
          },
          { event: 'done', data: { finish_reason: 'tool_calls' } },
        ])
      )
      .mockResolvedValueOnce(
        makeMockSSEResponse([
          { event: 'token', data: { delta: 'Berikut rekomendasi: ' } },
          { event: 'token', data: { delta: 'Kost Kenanga Sleman (Rp 1.250.000/bulan).' } },
          {
            event: 'done',
            data: {
              finish_reason: 'stop',
              content: 'Berikut rekomendasi: Kost Kenanga Sleman (Rp 1.250.000/bulan).',
            },
          },
        ])
      );

    global.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Cari kos putri di Sleman' }],
        stream: true,
      }),
    });

    const resp = await chatPost(req);
    expect(resp.status).toBe(200);
    expect(resp.headers.get('Content-Type')).toContain('text/event-stream');

    const rawText = await resp.text();
    const { events } = parseSSEFrames(rawText);
    const eventNames = events.map((e) => e.event);

    expect(eventNames).toContain('status');
    expect(eventNames).toContain('cards');
    expect(eventNames).toContain('token');
    expect(eventNames).toContain('done');

    const doneEvent = events.find((e) => e.event === 'done');
    expect(doneEvent).toBeDefined();
    const doneData = JSON.parse(doneEvent!.data) as {
      content: string;
      cards: Array<{ kosId: number }>;
      toolsUsed: string[];
    };
    expect(doneData.content).toContain('Kost Kenanga Sleman');
    expect(doneData.cards).toHaveLength(1);
    expect(doneData.cards[0].kosId).toBe(55);
    expect(doneData.toolsUsed).toEqual(['semanticSearch']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('supports LLM_PROVIDER=openai-compatible (vLLM / Ollama) with identical SSE output contract', async () => {
    process.env.LLM_PROVIDER = 'openai-compatible';
    process.env.LLM_SERVICE_URL = 'http://localhost:11434';
    process.env.LLM_MODEL_NAME = 'kosera-spk';

    expect(getLLMProvider()).toBe('openai-compatible');

    mockSemanticSearch.mockResolvedValueOnce({
      query: 'kos putra surabaya',
      searchType: 'semantic',
      total: 1,
      results: [
        {
          id: 88,
          postId: 188,
          name: 'Kost Putra Gubeng',
          title: 'Kost Putra Gubeng',
          city: 'Surabaya',
          subdistrict: 'Gubeng',
          gender: 'putra',
          roomSize: '3x4',
          facilities: 'WiFi, Parkir Motor',
          price: 850000,
          totalRooms: 10,
          occupiedRooms: 8,
          availableRooms: 2,
          similarityScore: 0.89,
        },
      ],
    });

    const fetchMock = vi
      .fn()
      // Round 1: OpenAI-compatible streamed tool_calls delta chunks (e.g. vLLM hermes parser)
      .mockResolvedValueOnce(
        makeMockOpenAISSEResponse([
          {
            choices: [
              {
                delta: {
                  tool_calls: [
                    {
                      index: 0,
                      id: 'call_vllm_1',
                      function: {
                        name: 'semanticSearch',
                        arguments: '{"query":"kos putra surabaya",',
                      },
                    },
                  ],
                },
              },
            ],
          },
          {
            choices: [
              {
                delta: {
                  tool_calls: [
                    {
                      index: 0,
                      function: {
                        arguments: '"city":"Surabaya","gender":"putra"}',
                      },
                    },
                  ],
                },
                finish_reason: 'tool_calls',
              },
            ],
          },
          '[DONE]',
        ])
      )
      // Round 2: OpenAI-compatible streamed text tokens
      .mockResolvedValueOnce(
        makeMockOpenAISSEResponse([
          {
            choices: [
              {
                delta: { content: 'Rekomendasi di Surabaya: ' },
              },
            ],
          },
          {
            choices: [
              {
                delta: { content: 'Kost Putra Gubeng (Rp 850.000/bulan, 2 kamar kosong).' },
                finish_reason: 'stop',
              },
            ],
          },
          '[DONE]',
        ])
      );

    global.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Cari kos putra di Surabaya' }],
        stream: true,
      }),
    });

    const resp = await chatPost(req);
    expect(resp.status).toBe(200);

    const rawText = await resp.text();
    const { events } = parseSSEFrames(rawText);
    const eventNames = events.map((e) => e.event);

    expect(eventNames).toContain('status');
    expect(eventNames).toContain('cards');
    expect(eventNames).toContain('token');
    expect(eventNames).toContain('done');

    const doneEvent = events.find((e) => e.event === 'done');
    const doneData = JSON.parse(doneEvent!.data) as {
      content: string;
      cards: Array<{ kosId: number }>;
      toolsUsed: string[];
    };
    expect(doneData.content).toContain('Kost Putra Gubeng');
    expect(doneData.cards[0].kosId).toBe(88);
    expect(doneData.toolsUsed).toEqual(['semanticSearch']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:11434/v1/chat/completions');
  });

  it('suppresses raw <tool_call> XML tokens when an OpenAI-compatible backend streams Qwen2.5 XML in delta.content', async () => {
    process.env.LLM_PROVIDER = 'openai-compatible';
    process.env.LLM_SERVICE_URL = 'http://localhost:11434';

    mockSemanticSearch.mockResolvedValueOnce({
      query: 'kos malang',
      searchType: 'semantic',
      total: 0,
      results: [],
    });

    const fetchMock = vi
      .fn()
      // Round 1: Ollama raw <tool_call> XML inside delta.content
      .mockResolvedValueOnce(
        makeMockOpenAISSEResponse([
          {
            choices: [
              {
                delta: {
                  content: '<tool_call>\n{"name": "semanticSearch", ',
                },
              },
            ],
          },
          {
            choices: [
              {
                delta: {
                  content: '"arguments": {"query": "kos malang", "city": "Malang"}}\n</tool_call>',
                },
                finish_reason: 'stop',
              },
            ],
          },
          '[DONE]',
        ])
      )
      // Round 2: Grounded empty answer
      .mockResolvedValueOnce(
        makeMockOpenAISSEResponse([
          {
            choices: [
              {
                delta: {
                  content: 'Maaf, belum ditemukan kos di Malang yang sesuai.',
                },
                finish_reason: 'stop',
              },
            ],
          },
          '[DONE]',
        ])
      );

    global.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Cari kos di Malang' }],
        stream: true,
      }),
    });

    const resp = await chatPost(req);
    const rawText = await resp.text();
    const { events } = parseSSEFrames(rawText);

    const tokenPayloads = events
      .filter((e) => e.event === 'token')
      .map((e) => (JSON.parse(e.data) as { delta: string }).delta)
      .join('');

    expect(tokenPayloads).not.toContain('<tool_call>');
    expect(tokenPayloads).toContain('Maaf, belum ditemukan kos di Malang');
  });
});

describe('POST /api/chat/feedback route (Phase 7.4)', () => {
  beforeEach(() => {
    resetFeedbackRateLimiter();
    mockInsertValues.mockReset();
    mockInsertReturning.mockReset();
  });

  it('computes a deterministic 64-char SHA-256 sessionHash without leaking raw identity', () => {
    const req = new Request('http://localhost:3000/api/chat/feedback', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '203.0.113.10',
        'user-agent': 'VitestBrowser/1.0',
      },
    });
    const hashA = computeAnonymizedSessionHash(req, 'sess-12345');
    const hashB = computeAnonymizedSessionHash(req, 'sess-12345');
    const hashC = computeAnonymizedSessionHash(req, 'sess-99999');

    expect(hashA).toMatch(/^[a-f0-9]{64}$/);
    expect(hashA).toBe(hashB);
    expect(hashA).not.toBe(hashC);
    expect(hashA).not.toContain('sess-12345');
  });

  it('persists valid thumbs-down feedback with toolsUsed and returns 201', async () => {
    mockInsertReturning.mockResolvedValueOnce([
      { id: 101, rating: 'down', createdAt: new Date('2026-11-19T05:00:00Z') },
    ]);

    const req = new Request('http://localhost:3000/api/chat/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt: 'Carikan kos putri di Sleman budget 1 juta',
        assistantResponse: 'Berikut rekomendasi kos di Sleman...',
        toolsUsed: ['semanticSearch'],
        rating: 'down',
        comment: 'Harga di kartu tidak sesuai filter',
        sessionId: 'sess-unit-test',
      }),
    });

    const resp = await feedbackPost(req);
    expect(resp.status).toBe(201);
    const body = (await resp.json()) as {
      success: boolean;
      data: { id: number; rating: string };
    };
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(101);
    expect(body.data.rating).toBe('down');
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        userPrompt: 'Carikan kos putri di Sleman budget 1 juta',
        assistantResponse: 'Berikut rekomendasi kos di Sleman...',
        toolsUsed: ['semanticSearch'],
        rating: 'down',
        comment: 'Harga di kartu tidak sesuai filter',
        sessionHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      })
    );
  });

  it('returns 400 when rating or required fields are invalid', async () => {
    const req = new Request('http://localhost:3000/api/chat/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt: '',
        assistantResponse: 'Jawaban',
        rating: 'neutral',
      }),
    });

    const resp = await feedbackPost(req);
    expect(resp.status).toBe(400);
    expect(mockInsertValues).not.toHaveBeenCalled();
  });
});
