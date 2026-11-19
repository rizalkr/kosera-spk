/**
 * Anonymized Chat Feedback API (Phase 7.4)
 *
 * Captures user thumbs-up / thumbs-down feedback on completed assistant
 * turns so flagged conversations can be exported into the SFT v2 curation
 * queue (`kosera-ai-service/scripts/export_feedback_to_sft.py`).
 *
 * Privacy contract:
 * - No user ID, email, or raw IP address is stored.
 * - `sessionHash` is a one-way SHA-256 hex digest computed on the server.
 *
 * @module app/api/chat/feedback
 */

import { createHash } from 'node:crypto';
import { z } from 'zod';
import { db } from '@/db';
import { chatFeedback } from '@/db/schema';
import { ok, fail } from '@/types/api';

export const dynamic = 'force-dynamic';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Reset in-memory rate-limit state (exported for deterministic unit tests).
 */
export function resetFeedbackRateLimiter(): void {
  rateLimitBuckets.clear();
}

export const chatFeedbackSchema = z.object({
  userPrompt: z.string().trim().min(1, 'userPrompt is required').max(4000),
  assistantResponse: z.string().trim().min(1, 'assistantResponse is required').max(12000),
  toolsUsed: z
    .array(z.string().trim().min(1).max(64))
    .max(10)
    .optional()
    .default([]),
  rating: z.enum(['up', 'down']),
  comment: z
    .string()
    .trim()
    .max(500, 'Comment cannot exceed 500 characters')
    .optional()
    .nullable(),
  sessionId: z.string().trim().max(128).optional(),
});

/**
 * Compute an irreversible 64-char SHA-256 hex session hash from either a
 * client-supplied ephemeral session ID or request headers.
 */
export function computeAnonymizedSessionHash(
  request: Request,
  clientSessionId?: string
): string {
  const salt = process.env.CHAT_FEEDBACK_SALT || 'kosera-spk-sft-v2-salt';
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const userAgent = request.headers.get('user-agent') || '';
  const rawIdentity = clientSessionId?.trim() || `${forwarded}|${userAgent}` || 'anonymous';

  return createHash('sha256')
    .update(`${salt}:${rawIdentity}`)
    .digest('hex');
}

function isRateLimited(sessionHash: string, now = Date.now()): boolean {
  // Periodic cleanup of expired buckets
  if (rateLimitBuckets.size > 500) {
    for (const [key, entry] of rateLimitBuckets.entries()) {
      if (entry.resetAt <= now) {
        rateLimitBuckets.delete(key);
      }
    }
  }

  const existing = rateLimitBuckets.get(sessionHash);
  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(sessionHash, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  return false;
}

/**
 * POST /api/chat/feedback
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return fail('invalid_json', 'Invalid JSON body', undefined, { status: 400 });
  }

  const parsed = chatFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      'validation_error',
      'Invalid chat feedback payload',
      parsed.error.flatten(),
      { status: 400 }
    );
  }

  const { userPrompt, assistantResponse, toolsUsed, rating, comment, sessionId } = parsed.data;
  const sessionHash = computeAnonymizedSessionHash(request, sessionId);

  if (isRateLimited(sessionHash)) {
    return fail(
      'rate_limited',
      'Terlalu banyak pengiriman feedback dalam waktu singkat. Silakan coba lagi nanti.',
      undefined,
      { status: 429 }
    );
  }

  try {
    const normalizedComment = comment && comment.length > 0 ? comment : null;
    const [inserted] = await db
      .insert(chatFeedback)
      .values({
        sessionHash,
        userPrompt,
        assistantResponse,
        toolsUsed,
        rating,
        comment: normalizedComment,
      })
      .returning({
        id: chatFeedback.id,
        rating: chatFeedback.rating,
        createdAt: chatFeedback.createdAt,
      });

    return ok(
      'Feedback berhasil disimpan',
      {
        id: inserted?.id ?? null,
        rating: inserted?.rating ?? rating,
        createdAt: inserted?.createdAt ?? new Date(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/chat/feedback] Error saving chat feedback:', error);
    return fail(
      'internal_error',
      'Gagal menyimpan feedback percakapan',
      undefined,
      { status: 500 }
    );
  }
}
