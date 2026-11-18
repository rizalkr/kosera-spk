"""FastAPI embedding microservice for Kosera SPK semantic search."""

from contextlib import asynccontextmanager
import os
from typing import Literal, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, status
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

DEFAULT_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", DEFAULT_MODEL)
AI_API_KEY = os.getenv("AI_API_KEY", "").strip()

_model: Optional[SentenceTransformer] = None
_dimension: int = 384


def _is_e5_model(model_name: str) -> bool:
    return "e5" in model_name.lower()


def _apply_prefix(text: str, mode: Optional[Literal["query", "passage"]]) -> str:
    if not _is_e5_model(EMBEDDING_MODEL):
        return text
    prefix = "query: " if mode == "query" else "passage: "
    if text.startswith("query: ") or text.startswith("passage: "):
        return text
    return f"{prefix}{text}"


def _verify_api_key(x_api_key: Optional[str] = Header(default=None)) -> None:
    if AI_API_KEY and x_api_key != AI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-API-Key header",
        )


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global _model, _dimension
    _model = SentenceTransformer(EMBEDDING_MODEL, device="cpu")
    detected_dim = _model.get_sentence_embedding_dimension()
    if detected_dim is not None:
        _dimension = int(detected_dim)
    yield
    _model = None


app = FastAPI(
    title="Kosera AI Embedding Service",
    version="1.0.0",
    lifespan=lifespan,
)


class VectorizeRequest(BaseModel):
    text: str = Field(..., min_length=1)
    mode: Optional[Literal["query", "passage"]] = None


class VectorizeBatchRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=256)
    mode: Optional[Literal["query", "passage"]] = None


@app.get("/health")
def health():
    return {
        "status": "AI Service is running",
        "model": EMBEDDING_MODEL,
        "dimension": _dimension,
        "ready": _model is not None,
    }


@app.post("/vectorize", dependencies=[Depends(_verify_api_key)])
def vectorize(payload: VectorizeRequest):
    if _model is None:
        raise HTTPException(status_code=503, detail="Embedding model is not loaded yet")

    clean_text = payload.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text must not be empty")

    prepared = _apply_prefix(clean_text, payload.mode or "query")
    vector = _model.encode(prepared, normalize_embeddings=True).tolist()

    return {
        "status": "success",
        "vector": vector,
        "dimension": len(vector),
        "model": EMBEDDING_MODEL,
    }


@app.post("/vectorize/batch", dependencies=[Depends(_verify_api_key)])
def vectorize_batch(payload: VectorizeBatchRequest):
    if _model is None:
        raise HTTPException(status_code=503, detail="Embedding model is not loaded yet")

    prepared: list[str] = []
    for idx, text in enumerate(payload.texts):
        clean_text = text.strip()
        if not clean_text:
            raise HTTPException(status_code=400, detail=f"Text at index {idx} must not be empty")
        prepared.append(_apply_prefix(clean_text, payload.mode or "passage"))

    vectors = _model.encode(
        prepared,
        batch_size=32,
        normalize_embeddings=True,
        show_progress_bar=False,
    ).tolist()

    return {
        "status": "success",
        "vectors": vectors,
        "count": len(vectors),
        "dimension": len(vectors[0]) if vectors else _dimension,
        "model": EMBEDDING_MODEL,
    }
