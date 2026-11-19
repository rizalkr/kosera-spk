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

import { db } from '@/db';
import { chatFeedback } from '@/db/schema';
import { ok, fail } from '@/types/api';
import {
  chatFeedbackSchema,
  computeAnonymizedSessionHash,
  isFeedbackRateLimited,
} from '@/lib/ai/chat-feedback';

export const dynamic = 'force-dynamic';

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

  if (isFeedbackRateLimited(sessionHash)) {
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
