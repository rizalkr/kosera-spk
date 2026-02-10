# AI Service Dockerfile
# Multi-stage build for optimized image size

# Stage 1: Download model during build
FROM python:3.11-slim as model-downloader

WORKDIR /app

# Install dependencies for model download
COPY requirements.txt .
RUN pip install --no-cache-dir sentence-transformers==2.3.1

# Create models directory
RUN mkdir -p /app/models

# Set cache directory
ENV TRANSFORMERS_CACHE=/app/models
ENV HF_HOME=/app/models

# Download and cache the model
COPY download_model.py .
RUN python download_model.py

# Stage 2: Production image
FROM python:3.11-slim as production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy pre-downloaded model from builder stage
COPY --from=model-downloader /app/models /app/models

# Set environment variables
ENV TRANSFORMERS_CACHE=/app/models
ENV HF_HOME=/app/models
ENV PYTHONUNBUFFERED=1

# Copy application code
COPY main.py .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
