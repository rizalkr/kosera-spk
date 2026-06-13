# Deployment Guide: Vercel & HuggingFace Spaces

## System Architecture

```text
+---------------------+         +----------------------+
|       VERCEL        |         |  HUGGINGFACE SPACES  |
|    (Next.js App)    |<------->|     (AI Service)     |
|                     |  HTTPS  |                      |
| - Frontend Logic    |         | - FastAPI Server     |
| - API Routing       |         | - Sentence Trans.    |
| - Profile Matching  |         | - Text Embeddings    |
+---------------------+         +----------------------+
          |                                |
          |                                |
          v                                |
+---------------------+                    |
|     PostgreSQL      |<-------------------+
|   (Supabase/Neon)   |    (Indirect execution via
|    + pgvector       |     Vercel API endpoints)
+---------------------+
```

## 1. AI Service Deployment (HuggingFace Spaces)

### Step 1: Repository Initialization
1. Navigate to https://huggingface.co/spaces
2. Select "Create new Space"
3. Configuration parameters:
   - **Space name**: `kosera-ai-service`
   - **SDK**: Docker
   - **Hardware**: CPU Basic (Free tier) or GPU instance
   - **Visibility**: Public or Private

### Step 2: Codebase Injection
```bash
# Clone the target HuggingFace repository
git clone [https://huggingface.co/spaces/YOUR_USERNAME/kosera-ai-service](https://huggingface.co/spaces/YOUR_USERNAME/kosera-ai-service)
cd kosera-ai-service

# Transfer AI service modules
cp -r /path/to/kosera-spk/ai-service/* .

# Verify HuggingFace YAML metadata in README.md
cat README.md
# Required metadata structure:
# ---
# title: Kosera AI Service
# sdk: docker
# app_port: 7860
# ---

# Execute push to remote
git add .
git commit -m "Initial AI service deployment"
git push
```

### Step 3: Deployment Verification
- Await build completion (Initial layer caching and model download ~500MB may take up to 10 minutes).
- Health check execution: `https://YOUR_USERNAME-kosera-ai-service.hf.space/health`

## 2. Next.js Deployment (Vercel)

### Step 1: Environment Variables Configuration
Inject the following variables into the Vercel Dashboard project settings:

```env
# Relational Database Connection (Requires pgvector extension)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Cryptographic Secret
JWT_SECRET=your-secure-jwt-key

# Remote AI Microservice Endpoint
AI_SERVICE_URL=https://YOUR_USERNAME-kosera-ai-service.hf.space

# Media Orchestration (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-id
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Step 2: Vercel Deployment Execution
```bash
# Install Vercel CLI pipeline
npm i -g vercel

# Execute deployment payload
cd /path/to/kosera-spk
vercel
```

## 3. Cross-Origin Resource Sharing (CORS) Protocol

Strict CORS policies must be enforced. The AI Service must whitelist the Vercel domain to accept incoming requests.

Verify the configuration in `ai-service/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "[https://your-production-domain.com](https://your-production-domain.com)",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 4. Vector Database Provisioning (pgvector)

### Option A: Supabase (Recommended for direct pgvector support)
1. Initialize a Supabase instance.
2. Execute SQL constraint to enable vector operations:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Execute Drizzle migrations.
4. Export the standard connection string to `DATABASE_URL`.

### Option B: Neon
1. Initialize a Neon instance (pgvector is typically enabled by default).
2. Execute migrations.
3. Export the pooled connection string.

## 5. End-to-End Integration Testing

### Direct AI Service Validation
```bash
# Validate vectorization payload
curl -X POST https://YOUR_USERNAME-kosera-ai-service.hf.space/vectorize \
  -H "Content-Type: application/json" \
  -d '{"text": "kos murah dekat kampus"}'
```

### Vercel API Gateway Validation
```bash
# Validate semantic search pipeline
curl -X POST [https://your-app.vercel.app/api/kos/semantic-search](https://your-app.vercel.app/api/kos/semantic-search) \
  -H "Content-Type: application/json" \
  -d '{"query": "kos nyaman dengan wifi cepat", "limit": 5}'
```

## 6. System Troubleshooting

### HuggingFace Container Fails to Start
- Inspect container logs in the HuggingFace dashboard.
- Verify `app_port: 7860` is explicitly declared in `README.md`.
- Verify the Dockerfile executes under a non-root user constraint.

### 504 Gateway Timeout on Vercel
- Cause: HuggingFace free instances spin down after inactivity. Cold starts take 30-60 seconds, exceeding Vercel's default serverless timeout.
- Resolution: Implement a keep-alive CRON job or upgrade the HuggingFace instance to a persistent state.

### Vector Embedding Fails to Persist
- Cause: Missing database extension.
- Resolution: Manually execute `CREATE EXTENSION IF NOT EXISTS vector;` in the SQL console before applying Drizzle migrations.