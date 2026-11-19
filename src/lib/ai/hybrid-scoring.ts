/**
 * Hybrid Scoring Primitives
 *
 * Pure, dependency-free helpers used by the hybrid recommendation algorithm.
 * Kept separate from `hybrid.ts` (which imports the database) so they can be
 * unit tested directly and reused by client-safe code.
 *
 * Scale contract:
 * - Profile Matching (Kusrini, 2007) raw score: GAP weight scale [0..5]
 *   (practically [1..5]).
 * - Semantic similarity raw score: cosine similarity [0..1].
 * - All combined scores (`profileMatchingScore`, `semanticScore`,
 *   `hybridScore`) are exposed on a common [0..100] scale.
 *
 * @module lib/ai/hybrid-scoring
 */

/** Maximum raw Profile Matching score on the Kusrini GAP weight scale */
export const PM_RAW_SCORE_MAX = 5;

/**
 * Normalize a raw Profile Matching score [0..5] to [0..100].
 */
export const normalizeProfileMatchingScore = (pmScore: number): number => {
  if (!Number.isFinite(pmScore)) return 0;
  const clamped = Math.max(0, Math.min(PM_RAW_SCORE_MAX, pmScore));
  return Math.round((clamped / PM_RAW_SCORE_MAX) * 100);
};

/**
 * Normalize cosine similarity [0..1] to [0..100].
 */
export const normalizeSemanticScore = (similarity: number): number => {
  if (!Number.isFinite(similarity)) return 0;
  const clamped = Math.max(0, Math.min(1, similarity));
  return Math.round(clamped * 100);
};

/**
 * Normalize a pair of weights so they sum to 1.
 * Falls back to an even split when both weights are zero or invalid.
 */
export const normalizeHybridWeights = (
  weightPM: number,
  weightAI: number
): { weightPM: number; weightAI: number } => {
  const pm = Number.isFinite(weightPM) && weightPM > 0 ? weightPM : 0;
  const ai = Number.isFinite(weightAI) && weightAI > 0 ? weightAI : 0;
  const total = pm + ai;
  if (total <= 0) return { weightPM: 0.5, weightAI: 0.5 };
  return { weightPM: pm / total, weightAI: ai / total };
};

/**
 * Combine normalized [0..100] scores into a [0..100] hybrid score.
 *
 * In `profile-matching-only` mode (no query / embedding service offline)
 * the hybrid score equals the normalized Profile Matching score.
 */
export const computeHybridScore = (
  pmScoreNormalized: number,
  semanticScore: number,
  weightPM: number,
  weightAI: number,
  mode: 'hybrid' | 'profile-matching-only' = 'hybrid'
): number => {
  if (mode === 'profile-matching-only') {
    return Math.round(pmScoreNormalized);
  }
  const weights = normalizeHybridWeights(weightPM, weightAI);
  return Math.round(weights.weightPM * pmScoreNormalized + weights.weightAI * semanticScore);
};

/**
 * Convert a [0..100] score to the [0..1] scale (4 decimals) used by the
 * SFT v1 `<tool_response>` schema the fine-tuned model was trained on.
 */
export const toUnitScore = (score0to100: number): number => {
  if (!Number.isFinite(score0to100)) return 0;
  const clamped = Math.max(0, Math.min(100, score0to100));
  return Number((clamped / 100).toFixed(4));
};
