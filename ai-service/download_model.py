"""
Script to pre-download the Sentence Transformer model during Docker build.
This ensures the model is cached and doesn't need to be downloaded at runtime.
"""

from sentence_transformers import SentenceTransformer
import os

MODEL_NAME = "all-MiniLM-L6-v2"
CACHE_DIR = os.environ.get("TRANSFORMERS_CACHE", "/app/models")

def download_model():
    """Download and cache the sentence transformer model."""
    print(f"Downloading model: {MODEL_NAME}")
    print(f"Cache directory: {CACHE_DIR}")
    
    # Download the model (will be cached automatically)
    model = SentenceTransformer(MODEL_NAME, cache_folder=CACHE_DIR)
    
    # Test the model with a sample text
    test_embedding = model.encode("Test sentence for model verification")
    print(f"Model downloaded successfully!")
    print(f"Embedding dimension: {len(test_embedding)}")
    
    return model

if __name__ == "__main__":
    download_model()
