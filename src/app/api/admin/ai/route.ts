/**
 * AI Indexing Admin API
 *
 * Endpoints for managing AI embedding generation and statistics.
 * Restricted to admin users only.
 *
 * @module app/api/admin/ai
 */

import { withAdmin, AuthenticatedRequest } from '@/lib/middleware';
import {
  indexBatch,
  indexSingleKos,
  getIndexingStats,
  checkHealth,
} from '@/lib/ai';
import { ok, fail } from '@/types/api';

/** AI service status response data */
interface AIStatusData {
  aiService: {
    status: 'online' | 'offline';
    model: string | null;
    dimension: number | null;
  };
  indexing: {
    total: number;
    indexed: number;
    unindexed: number;
    percentComplete: number;
  };
}

/** Indexing result response data */
interface IndexingResultData {
  message: string;
  result?: {
    kosId: number;
    success: boolean;
    error?: string;
  };
  summary?: {
    totalProcessed: number;
    successful: number;
    failed: number;
    results: Array<{
      kosId: number;
      success: boolean;
      error?: string;
    }>;
  };
}

/**
 * GET /api/admin/ai
 *
 * Get AI indexing status and statistics
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getAIStatusHandler(_request: AuthenticatedRequest) {
  try {
    // Check AI service health
    let aiServiceStatus: 'online' | 'offline' = 'offline';
    let aiServiceInfo = null;

    try {
      aiServiceInfo = await checkHealth();
      aiServiceStatus = 'online';
    } catch {
      // AI service is not available
    }

    // Get indexing statistics
    const indexingStats = await getIndexingStats();

    const responseData: AIStatusData = {
      aiService: {
        status: aiServiceStatus,
        model: aiServiceInfo?.model ?? null,
        dimension: aiServiceInfo?.dimension ?? null,
      },
      indexing: indexingStats,
    };

    return ok('AI status retrieved', responseData);
  } catch (error) {
    console.error('Failed to get AI status:', error);
    return fail('internal_error', 'Failed to get AI status', undefined, { status: 500 });
  }
}

/**
 * POST /api/admin/ai
 *
 * Trigger batch indexing of kos listings
 *
 * Body:
 * - batchSize?: number (default: 20, max: 50)
 * - maxTotal?: number (default: 100, max: 500)
 * - kosId?: number (if specified, only index this single kos)
 */
async function triggerIndexingHandler(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { batchSize = 20, maxTotal = 100, kosId } = body;

    // Validate parameters
    const safeBatchSize = Math.min(Math.max(1, batchSize), 50);
    const safeMaxTotal = Math.min(Math.max(1, maxTotal), 500);

    // Check AI service is available first
    try {
      await checkHealth();
    } catch {
      return fail(
        'ai_service_unavailable',
        'AI service is not available. Please ensure it is running.',
        undefined,
        { status: 503 }
      );
    }

    // If specific kosId provided, index only that one
    if (kosId !== undefined) {
      const result = await indexSingleKos(kosId);
      const responseData: IndexingResultData = {
        message: result.success
          ? 'Kos indexed successfully'
          : 'Failed to index kos',
        result,
      };
      return ok('Indexing complete', responseData);
    }

    // Otherwise, run batch indexing
    const summary = await indexBatch(safeBatchSize, safeMaxTotal);

    const responseData: IndexingResultData = {
      message: `Indexed ${summary.successful} of ${summary.totalProcessed} kos listings`,
      summary,
    };

    return ok('Batch indexing complete', responseData);
  } catch (error) {
    console.error('Failed to trigger indexing:', error);
    return fail('ai_indexing_failed', 'Failed to trigger indexing', undefined, { status: 500 });
  }
}

// Apply admin authentication middleware
export const GET = withAdmin(getAIStatusHandler);
export const POST = withAdmin(triggerIndexingHandler);
