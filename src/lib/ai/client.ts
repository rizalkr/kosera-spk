/**
 * AI Service Client
 *
 * HTTP client for communicating with the Python AI microservice.
 * Used internally by Next.js server-side code only.
 *
 * @module lib/ai/client
 */

/** Response from vectorize endpoint */
interface VectorizeResponse {
  text: string;
  embedding: number[];
  dimension: number;
  model: string;
}

/** Response from batch vectorize endpoint */
interface BatchVectorizeResponse {
  results: VectorizeResponse[];
  total: number;
  model: string;
}

/** Health check response */
interface HealthResponse {
  status: string;
  model: string;
  dimension: number;
}

/** Error response from AI service */
interface AIErrorResponse {
  detail: string;
}

/**
 * Custom error for AI service failures
 */
export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly detail?: string
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

/**
 * Get AI service base URL from environment
 * Defaults to internal Docker network URL
 */
const getAIServiceUrl = (): string => {
  return process.env.AI_SERVICE_URL || 'http://ai-service:8000';
};

/**
 * Check if AI service is healthy and model is loaded
 *
 * @returns Health status with model info
 * @throws AIServiceError if service is unavailable
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  const baseUrl = getAIServiceUrl();

  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new AIServiceError(
        'AI service health check failed',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new AIServiceError(
      'AI service is unavailable',
      503,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Generate embedding vector for a single text
 *
 * @param text - Text to vectorize
 * @returns Embedding vector with metadata
 * @throws AIServiceError if vectorization fails
 */
export const vectorize = async (text: string): Promise<VectorizeResponse> => {
  const baseUrl = getAIServiceUrl();

  try {
    const response = await fetch(`${baseUrl}/vectorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = (await response.json()) as AIErrorResponse;
      throw new AIServiceError(
        'Failed to vectorize text',
        response.status,
        error.detail
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new AIServiceError(
      'AI service request failed',
      503,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Generate embedding vectors for multiple texts in batch
 *
 * @param texts - Array of texts to vectorize
 * @returns Array of embeddings with metadata
 * @throws AIServiceError if any text is empty or vectorization fails
 */
export const vectorizeBatch = async (
  texts: string[]
): Promise<BatchVectorizeResponse> => {
  const baseUrl = getAIServiceUrl();

  // Client-side validation to catch errors early
  const emptyIndices = texts
    .map((t, i) => (t.trim() === '' ? i : -1))
    .filter((i) => i !== -1);

  if (emptyIndices.length > 0) {
    throw new AIServiceError(
      `Empty text at indices: ${emptyIndices.join(', ')}`,
      400,
      'All texts must be non-empty strings'
    );
  }

  try {
    const response = await fetch(`${baseUrl}/vectorize/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ texts }),
    });

    if (!response.ok) {
      const error = (await response.json()) as AIErrorResponse;
      throw new AIServiceError(
        'Failed to vectorize batch',
        response.status,
        error.detail
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new AIServiceError(
      'AI service batch request failed',
      503,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
