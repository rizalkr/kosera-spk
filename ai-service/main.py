"""
AI Service for Kosera SPK
Provides text embedding generation using Sentence Transformers.

Endpoints:
- GET /health - Health check
- POST /vectorize - Generate embedding for single text
- POST /vectorize/batch - Generate embeddings for multiple texts
"""

import os
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

# Configuration
MODEL_NAME = "all-MiniLM-L6-v2"
CACHE_DIR = os.environ.get("TRANSFORMERS_CACHE", "/app/models")
EMBEDDING_DIMENSION = 384  # Output dimension for all-MiniLM-L6-v2

# Initialize FastAPI app
app = FastAPI(
    title="Kosera AI Service",
    description="Text embedding service for semantic search in Kosera SPK",
    version="1.0.0"
)

# CORS middleware (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup (cached from Docker build)
print(f"Loading model: {MODEL_NAME} from {CACHE_DIR}")
model = SentenceTransformer(MODEL_NAME, cache_folder=CACHE_DIR)
print(f"Model loaded successfully! Embedding dimension: {EMBEDDING_DIMENSION}")


# ============================================================
# Request/Response Models
# ============================================================

class TextRequest(BaseModel):
    """Request model for single text vectorization."""
    text: str = Field(..., min_length=1, description="Text to vectorize")


class BatchTextRequest(BaseModel):
    """Request model for batch text vectorization."""
    texts: List[str] = Field(..., min_items=1, max_items=100, description="List of texts to vectorize")


class VectorResponse(BaseModel):
    """Response model for single vector."""
    status: str = "success"
    vector: List[float]
    dimension: int = EMBEDDING_DIMENSION


class BatchVectorResponse(BaseModel):
    """Response model for batch vectors."""
    status: str = "success"
    vectors: List[List[float]]
    count: int
    dimension: int = EMBEDDING_DIMENSION


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    model: str
    dimension: int


# ============================================================
# Endpoints
# ============================================================

@app.get("/", response_model=HealthResponse)
@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint to verify service is running."""
    return HealthResponse(
        status="AI Service is running",
        model=MODEL_NAME,
        dimension=EMBEDDING_DIMENSION
    )


@app.post("/vectorize", response_model=VectorResponse)
def generate_vector(payload: TextRequest):
    """
    Generate embedding vector for a single text.
    
    The model (all-MiniLM-L6-v2) outputs a 384-dimensional vector
    that captures the semantic meaning of the input text.
    """
    try:
        if not payload.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty or whitespace only")
        
        # Generate embedding (CPU-based, fast for short texts)
        vector_embedding = model.encode(payload.text).tolist()
        
        return VectorResponse(
            status="success",
            vector=vector_embedding,
            dimension=len(vector_embedding)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")


@app.post("/vectorize/batch", response_model=BatchVectorResponse)
def generate_vectors_batch(payload: BatchTextRequest):
    """
    Generate embedding vectors for multiple texts in a single request.
    
    More efficient than calling /vectorize multiple times due to batching.
    Maximum 100 texts per request.
    """
    try:
        # Validate texts are not empty
        valid_texts = [t.strip() for t in payload.texts if t.strip()]
        if not valid_texts:
            raise HTTPException(status_code=400, detail="All texts are empty or whitespace only")
        
        # Generate embeddings in batch (much faster than individual calls)
        vectors = model.encode(valid_texts).tolist()
        
        return BatchVectorResponse(
            status="success",
            vectors=vectors,
            count=len(vectors),
            dimension=EMBEDDING_DIMENSION
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch embedding generation failed: {str(e)}")


# ============================================================
# Startup/Shutdown Events
# ============================================================

@app.on_event("startup")
async def startup_event():
    """Log startup information."""
    print("=" * 50)
    print("Kosera AI Service Started")
    print(f"Model: {MODEL_NAME}")
    print(f"Embedding Dimension: {EMBEDDING_DIMENSION}")
    print("=" * 50)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    print("Kosera AI Service Shutting Down")


# ============================================================
# Run with: uvicorn main:app --host 0.0.0.0 --port 8000
# ============================================================
