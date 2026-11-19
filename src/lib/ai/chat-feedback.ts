/**
 * Chat Feedback Schema, Session Anonymization, and Rate Limiter Helpers (Phase 7.4)
 *
 * Kept in `src/lib/ai/` so Next.js 15 route type generation on
 * `src/app/api/chat/feedback/route.ts` only sees valid HTTP handler exports.
 *
 * @module lib/ai/chat-feedback
 */

import { createHash } from 'node:crypto';
import { z } from 'zod';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Reset in-memory rate-limit state (used by deterministic unit tests).
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

export function isFeedbackRateLimited(sessionHash: string, now = Date.now()): boolean {
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
