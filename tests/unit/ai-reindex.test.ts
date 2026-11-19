/**
 * Automated Embedding Re-Indexing Unit Tests (Phase 7.3)
 *
 * Verifies that kos create/update/restore handlers schedule an embedding
 * refresh via `scheduleKosReindex`, that the refresh runs after the response
 * (Next.js `after()`), and that an offline embedding service never fails the
 * CRUD request. Uses an in-memory Drizzle chain mock (no PostgreSQL needed).
 *
 * @module tests/unit/ai-reindex.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { kos as kosTable, posts as postsTable } from '@/db/schema';

// ============================================================
// MOCKS
// ============================================================

type DbOp = { op: 'select' | 'insert' | 'update' | 'delete'; table?: unknown; set?: Record<string, unknown> };

const {
  dbState,
  mockDb,
  mockVectorize,
  afterCallbacks,
  mockAfter,
  mockVerifyToken,
} = vi.hoisted(() => {
  const dbState: { results: unknown[]; calls: DbOp[] } = { results: [], calls: [] };

  function makeChain(entry: DbOp) {
    dbState.calls.push(entry);
    const chain: Record<string, unknown> = {};
    const passthrough = ['from', 'innerJoin', 'leftJoin', 'where', 'limit', 'values', 'returning', 'orderBy'];
    for (const method of passthrough) {
      chain[method] = () => chain;
    }
    chain.set = (values: Record<string, unknown>) => {
      entry.set = values;
      return chain;
    };
    chain.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) => {
      const next = dbState.results.length > 0 ? dbState.results.shift() : [];
      if (next instanceof Error) return Promise.reject(next).then(resolve, reject);
      return Promise.resolve(next).then(resolve, reject);
    };
    return chain;
  }

  const mockDb = {
    select: () => makeChain({ op: 'select' }),
    insert: (table: unknown) => makeChain({ op: 'insert', table }),
    update: (table: unknown) => makeChain({ op: 'update', table }),
    delete: (table: unknown) => makeChain({ op: 'delete', table }),
  };

  const mockVectorize = vi.fn();
  const afterCallbacks: Array<() => unknown> = [];
  const mockAfter = vi.fn((cb: () => unknown) => {
    afterCallbacks.push(cb);
  });
  const mockVerifyToken = vi.fn();

  return {
    dbState,
    mockDb,
    mockVectorize,
    afterCallbacks,
    mockAfter,
    mockVerifyToken,
  };
});

vi.mock('@/db', async () => {
  const schema = await vi.importActual<typeof import('@/db/schema')>('@/db/schema');
  return { ...schema, db: mockDb };
});

vi.mock('@/lib/ai/client', async () => {
  const actual = await vi.importActual<typeof import('@/lib/ai/client')>('@/lib/ai/client');
  return {
    ...actual,
    vectorize: (...args: unknown[]) => mockVectorize(...args),
    vectorizeBatch: vi.fn(),
  };
});

vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server');
  return { ...actual, after: (cb: () => unknown) => mockAfter(cb) };
});

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');
  return { ...actual, verifyToken: (...args: unknown[]) => mockVerifyToken(...args) };
});

import { AIServiceError } from '@/lib/ai/client';
import { scheduleKosReindex, runKosReindexSafely } from '@/lib/ai/indexer';
import { POST as createKos } from '@/app/api/kos/route';
import { PUT as updateKos } from '@/app/api/kos/[id]/route';
import { PATCH as restoreKos } from '@/app/api/admin/kos/[id]/restore/route';

// ============================================================
// HELPERS
// ============================================================

const KOS_INDEX_ROW = {
  id: 42,
  name: 'Kos Melati',
  address: 'Jl. Kaliurang Km 5',
  city: 'Sleman',
  facilities: 'WiFi, AC',
  gender: 'putri',
  subdistrict: 'Depok',
  roomSize: '3x4',
  nearbyFacilities: 'UGM',
  rules: null,
  totalRooms: 10,
  occupiedRooms: 4,
  postTitle: 'Kos Melati dekat UGM',
  postDescription: 'Kos nyaman dekat kampus.',
  price: 1200000,
};

const FAKE_EMBEDDING = Array.from({ length: 384 }, () => 0.01);

async function flushAfterCallbacks(): Promise<void> {
  while (afterCallbacks.length > 0) {
    const cb = afterCallbacks.shift()!;
    await cb();
  }
}

function embeddingUpdates(): DbOp[] {
  return dbState.calls.filter((c) => c.op === 'update' && c.table === kosTable && c.set && 'embedding' in c.set);
}

function authedRequest(url: string, method: string, body?: unknown): Request {
  return new Request(url, {
    method,
    headers: { authorization: 'Bearer test-token', 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  dbState.results = [];
  dbState.calls = [];
  afterCallbacks.length = 0;
  mockAfter.mockClear();
  mockVectorize.mockReset();
  mockVerifyToken.mockReset();
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

// ============================================================
// SCHEDULER
// ============================================================

describe('scheduleKosReindex', () => {
  it('defers work through Next.js after() and does not touch the DB synchronously', () => {
    scheduleKosReindex(42, 'update');
    expect(mockAfter).toHaveBeenCalledTimes(1);
    expect(dbState.calls).toHaveLength(0);
    expect(mockVectorize).not.toHaveBeenCalled();
  });

  it('ignores invalid kos IDs', () => {
    scheduleKosReindex(0);
    scheduleKosReindex(-3);
    scheduleKosReindex(Number.NaN);
    expect(mockAfter).not.toHaveBeenCalled();
  });

  it('writes the refreshed embedding when the embedding service is online', async () => {
    dbState.results.push([KOS_INDEX_ROW], []);
    mockVectorize.mockResolvedValue({ embedding: FAKE_EMBEDDING });

    scheduleKosReindex(42, 'update');
    await flushAfterCallbacks();

    expect(mockVectorize).toHaveBeenCalledWith(expect.stringContaining('Kos Melati'), 'passage');
    const updates = embeddingUpdates();
    expect(updates).toHaveLength(1);
    expect(updates[0].set?.embedding).toEqual(FAKE_EMBEDDING);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('logs a structured warning and never throws when the embedding service is offline', async () => {
    dbState.results.push([KOS_INDEX_ROW]);
    mockVectorize.mockRejectedValue(new AIServiceError('AI service unavailable', 503, 'connect ECONNREFUSED'));

    scheduleKosReindex(42, 'update');
    await expect(flushAfterCallbacks()).resolves.toBeUndefined();

    expect(embeddingUpdates()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalledWith(
      '[ai.reindex] Embedding refresh failed',
      expect.objectContaining({ kosId: 42, reason: 'update', error: 'connect ECONNREFUSED' })
    );
  });

  it('falls back to fire-and-forget when after() is unavailable outside a request scope', async () => {
    mockAfter.mockImplementationOnce(() => {
      throw new Error('`after` was called outside a request scope');
    });
    dbState.results.push([KOS_INDEX_ROW], []);
    mockVectorize.mockResolvedValue({ embedding: FAKE_EMBEDDING });

    expect(() => scheduleKosReindex(42, 'manual')).not.toThrow();
    await vi.waitFor(() => expect(embeddingUpdates()).toHaveLength(1));
  });

  it('runKosReindexSafely swallows unexpected database errors', async () => {
    dbState.results.push(new Error('connection terminated'));
    const result = await runKosReindexSafely(42, 'manual');
    expect(result.success).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });
});

// ============================================================
// ROUTE WIRING
// ============================================================

describe('Kos CRUD routes trigger re-indexing', () => {
  it('POST /api/kos returns 200 and schedules indexing for the new kos even if the embedding service is down', async () => {
    mockVerifyToken.mockReturnValue({ userId: 7, role: 'SELLER', username: 'seller', email: 's@x.id' });
    const now = new Date();
    dbState.results.push(
      [{ id: 900, title: 'Kos Baru', description: 'Desc', price: 900000, totalPost: 1, totalPenjualan: 0, createdAt: now, updatedAt: now }],
      [{ id: 501, postId: 900, name: 'Kos Baru', address: 'Jl. A', city: 'Sleman', facilities: 'WiFi', totalRooms: 5, occupiedRooms: 0 }]
    );
    mockVectorize.mockRejectedValue(new AIServiceError('AI service unavailable', 503));

    const res = await createKos(
      authedRequest('http://localhost/api/kos', 'POST', {
        name: 'Kos Baru',
        address: 'Jl. A',
        city: 'Sleman',
        facilities: ['WiFi'],
        title: 'Kos Baru',
        description: 'Desc',
        price: 900000,
        totalRooms: 5,
      })
    );

    expect(res.status).toBe(200);
    expect(mockAfter).toHaveBeenCalledTimes(1);

    // Embedding work happens only after the response
    dbState.results.push([{ ...KOS_INDEX_ROW, id: 501 }]);
    await flushAfterCallbacks();
    expect(mockVectorize).toHaveBeenCalledTimes(1);
    expect(embeddingUpdates()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalledWith(
      '[ai.reindex] Embedding refresh failed',
      expect.objectContaining({ kosId: 501, reason: 'create' })
    );
  });

  it('PUT /api/kos/[id] returns 200 and refreshes the embedding with the edited data', async () => {
    mockVerifyToken.mockReturnValue({ userId: 7, role: 'SELLER', username: 'seller', email: 's@x.id' });
    dbState.results.push(
      [{ id: 42, postId: 300, ownerId: 7 }], // ownership lookup
      [], // update kos
      [], // update posts
      [{ id: 42, postId: 300, name: 'Kos Melati Baru', city: 'Sleman' }] // re-select
    );

    const res = await updateKos(
      authedRequest('http://localhost/api/kos/42', 'PUT', {
        title: 'Kos Melati Baru',
        description: 'Sekarang ada AC',
        price: 1300000,
        name: 'Kos Melati Baru',
        address: 'Jl. Kaliurang Km 5',
        city: 'Sleman',
        facilities: 'WiFi, AC',
        totalRooms: 10,
        occupiedRooms: 4,
      })
    );

    expect(res.status).toBe(200);
    expect(mockAfter).toHaveBeenCalledTimes(1);

    dbState.results.push([{ ...KOS_INDEX_ROW, name: 'Kos Melati Baru', price: 1300000 }], []);
    mockVectorize.mockResolvedValue({ embedding: FAKE_EMBEDDING });
    await flushAfterCallbacks();

    expect(mockVectorize).toHaveBeenCalledWith(expect.stringContaining('Kos Melati Baru'), 'passage');
    expect(embeddingUpdates()).toHaveLength(1);
  });

  it('PUT /api/kos/[id] does not schedule indexing when the request is rejected', async () => {
    mockVerifyToken.mockReturnValue({ userId: 8, role: 'SELLER', username: 'other', email: 'o@x.id' });
    dbState.results.push([{ id: 42, postId: 300, ownerId: 7 }]);

    const res = await updateKos(
      authedRequest('http://localhost/api/kos/42', 'PUT', {
        title: 'X',
        description: 'Y',
        price: 1000000,
        name: 'X',
        address: 'Z',
        city: 'Sleman',
        totalRooms: 5,
      })
    );

    expect(res.status).toBe(403);
    expect(mockAfter).not.toHaveBeenCalled();
  });

  it('PATCH /api/admin/kos/[id]/restore returns 200 and schedules indexing', async () => {
    mockVerifyToken.mockReturnValue({ userId: 1, role: 'ADMIN', username: 'admin', email: 'a@x.id' });
    dbState.results.push([{ id: 42, postId: 300 }], [], []);

    const res = await restoreKos(authedRequest('http://localhost/api/admin/kos/42/restore', 'PATCH'));

    expect(res.status).toBe(200);
    expect(mockAfter).toHaveBeenCalledTimes(1);

    dbState.results.push([KOS_INDEX_ROW]);
    mockVectorize.mockRejectedValue(new AIServiceError('timeout', 504));
    await expect(flushAfterCallbacks()).resolves.toBeUndefined();
    expect(postsTable).toBeDefined();
  });
});
