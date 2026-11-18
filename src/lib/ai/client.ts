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

/** Raw response from AI service vectorize endpoint */
interface AIVectorizeResponse {
  vector: number[];
  dimension: number;
  model?: string;
  status: string;
}

/** Response from batch vectorize endpoint */
interface BatchVectorizeResponse {
  results: VectorizeResponse[];
  total: number;
  model: string;
}

/** Raw response from AI service batch vectorize endpoint */
interface AIBatchVectorizeResponse {
  vectors: number[][];
  count: number;
  dimension: number;
  model?: string;
  status: string;
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
 * Build request headers including optional API key
 */
const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (process.env.AI_API_KEY) {
    headers['X-API-Key'] = process.env.AI_API_KEY;
  }
  return headers;
};

/**
 * Fetch with retry for handling HuggingFace Spaces cold start
 * HF Spaces can take 30-60 seconds to wake up from sleep mode
 */
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries = 3,
  initialDelay = 5000
): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      // Longer timeout for cold start (60 seconds)
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on abort or if it's the last attempt
      if (attempt === maxRetries - 1) break;
      
      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`AI service request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Failed after retries');
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
export const vectorize = async (
  text: string,
  mode?: 'query' | 'passage'
): Promise<VectorizeResponse> => {
  const baseUrl = getAIServiceUrl();

  try {
    const response = await fetchWithRetry(`${baseUrl}/vectorize`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(mode ? { text, mode } : { text }),
    });

    if (!response.ok) {
      const error = (await response.json()) as AIErrorResponse;
      throw new AIServiceError(
        'Failed to vectorize text',
        response.status,
        error.detail
      );
    }

    // Map AI service response to expected format
    const aiResponse = (await response.json()) as AIVectorizeResponse;
    return {
      text,
      embedding: aiResponse.vector,
      dimension: aiResponse.dimension,
      model: aiResponse.model || 'paraphrase-multilingual-MiniLM-L12-v2',
    };
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
  texts: string[],
  mode?: 'query' | 'passage'
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
    const response = await fetchWithRetry(`${baseUrl}/vectorize/batch`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(mode ? { texts, mode } : { texts }),
    });

    if (!response.ok) {
      const error = (await response.json()) as AIErrorResponse;
      throw new AIServiceError(
        'Failed to vectorize batch',
        response.status,
        error.detail
      );
    }

    // Map AI service response to expected format
    const aiResponse = (await response.json()) as AIBatchVectorizeResponse;
    const modelName = aiResponse.model || 'paraphrase-multilingual-MiniLM-L12-v2';
    return {
      results: texts.map((text, i) => ({
        text,
        embedding: aiResponse.vectors[i],
        dimension: aiResponse.dimension,
        model: modelName,
      })),
      total: aiResponse.count,
      model: modelName,
    };
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new AIServiceError(
      'AI service batch request failed',
      503,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
