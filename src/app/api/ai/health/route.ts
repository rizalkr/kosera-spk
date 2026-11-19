/**
 * AI Health Check API
 * 
 * Public endpoint to check if AI service is available
 * Used by frontend to determine if semantic search can be used
 * 
 * @module app/api/ai/health
 */

import { NextResponse } from 'next/server';
import { checkHealth, checkLLMHealth, getIndexingStats } from '@/lib/ai';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ai/health
 * 
 * Check AI service health status (embedding service + optional LLM chat server)
 */
export async function GET() {
  const llmPromise = checkLLMHealth();

  try {
    // Check AI embedding service health
    const [health, stats, llm] = await Promise.all([
      checkHealth(),
      getIndexingStats(),
      llmPromise,
    ]);

    return NextResponse.json({
      status: 'online',
      model: health.model,
      dimension: health.dimension,
      indexing: {
        total: stats.total,
        indexed: stats.indexed,
        percentComplete: stats.total > 0 
          ? Math.round((stats.indexed / stats.total) * 100) 
          : 0,
      },
      llm,
    });
  } catch {
    const llm = await llmPromise;
    return NextResponse.json({
      status: 'offline',
      model: null,
      dimension: null,
      indexing: null,
      llm,
    });
  }
}
