# Kosera AI Service

Python microservice for text embedding generation using Sentence Transformers.

## Overview

This service provides semantic text embedding capabilities for the Kosera SPK (Decision Support System). It uses the `all-MiniLM-L6-v2` model to convert text descriptions into 384-dimensional vectors for similarity search.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Health check |
| POST | `/vectorize` | Generate embedding for single text |
| POST | `/vectorize/batch` | Generate embeddings for multiple texts |

## API Examples

### Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "AI Service is running",
  "model": "all-MiniLM-L6-v2",
  "dimension": 384
}
```

### Single Text Vectorization

```bash
curl -X POST http://localhost:8000/vectorize \
  -H "Content-Type: application/json" \
  -d '{"text": "Kos nyaman dekat kampus dengan WiFi dan AC"}'
```

Response:
```json
{
  "status": "success",
  "vector": [0.123, -0.456, ...],
  "dimension": 384
}
```

### Batch Vectorization

```bash
curl -X POST http://localhost:8000/vectorize/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Kos murah dekat kampus", "Kos mewah dengan kolam renang"]}'
```

Response:
```json
{
  "status": "success",
  "vectors": [[0.123, ...], [0.456, ...]],
  "count": 2,
  "dimension": 384
}
```

## Local Development

### Without Docker

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Download model (first time only)
python download_model.py

# Run the service
uvicorn main:app --reload --port 8000
```

### With Docker

```bash
# Build image
docker build -t kosera-ai-service .

# Run container
docker run -p 8000:8000 kosera-ai-service
```

## Model Information

- **Model**: `all-MiniLM-L6-v2`
- **Size**: ~80MB
- **Dimension**: 384
- **Speed**: ~5ms per text (CPU)
- **Use Case**: Semantic similarity, text search

## Architecture

```
Next.js App (Port 3000)
       |
       | HTTP POST /vectorize
       v
AI Service (Port 8000)
       |
       | Sentence Transformers
       v
384-dim Vector
       |
       | Store in PostgreSQL
       v
pgvector (cosine similarity search)
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TRANSFORMERS_CACHE` | `/app/models` | Model cache directory |
| `HF_HOME` | `/app/models` | Hugging Face home directory |
