# KOSERA SPK (AI-Enhanced Indekos Decision Support & Recommendation System)

KOSERA is a production-scale boarding house (indekos) property management platform and Decision Support System (DSS / SPK). It combines **Profile Matching (Kusrini, 2007)**, **384-dimensional `pgvector` HNSW Semantic Search** (`paraphrase-multilingual-MiniLM-L12-v2` across 7,000+ listings), and a **Fine-Tuned Conversational RAG Assistant** (`Qwen/Qwen2.5-7B-Instruct` + QLoRA) that executes live PostgreSQL tool calls (`semanticSearch`, `getHybridRecommendations`) and streams grounded Indonesian recommendations over SSE.

---

## Core Architecture & AI Engine

### 1. Multi-Tenant Role-Based Access Control (RBAC)
1. **Admin Operations:** System-wide entity moderation, centralized platform analytics visualization, AI embedding indexing dashboard, and data lifecycle management (soft delete, restore with automatic embedding refresh, permanent delete).
2. **Seller Center:** Dedicated operational dashboard for property owners, room inventory management, and transactional booking processing.
3. **Renter Experience:** Geospatial map integration, interactive side-by-side kos comparison dock, personalized SPK Profile Matching preferences, and a floating AI conversational assistant.

### 2. Dual AI Microservice Architecture
Kosera separates lightweight vector embedding from 7B LLM generation so semantic search and SPK hybrid ranking remain operational even when the LLM server is offline:

| Service | Role | Default Port | Key Environment Variables |
| :--- | :--- | :--- | :--- |
| **Embedding Service** (`./ai-service/`) | Encodes kos listings and search queries into 384-dim normalized vectors (`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`) on CPU for `pgvector` HNSW cosine similarity and SPK Hybrid (`70% PM + 30% Semantic`) scoring. Automatically re-indexes on kos create/edit/restore via `scheduleKosReindex()`. | `8000` | `AI_SERVICE_URL`, `AI_API_KEY` |
| **Conversational LLM Service** (`kosera-ai-service`) | Runs the fine-tuned `Qwen/Qwen2.5-7B-Instruct` + QLoRA assistant. Supports 2-round agentic tool calling (`semanticSearch`, `getHybridRecommendations`), SSE token streaming (`KoseraChatWidget`), and anonymized feedback logging (`POST /api/chat/feedback`) for SFT v2 continuous improvement. | `8001` (FastAPI / vLLM) or `11434` (Ollama) | `LLM_PROVIDER`, `LLM_SERVICE_URL`, `LLM_MODEL_NAME`, `LLM_API_KEY` |

---

## Technology Stack

* **Core Framework:** Next.js 15 (App Router, Turbopack), React 19, TypeScript
* **Database & Vector Store:** PostgreSQL 16 with `pgvector` 0.8+ (HNSW index + `iterative_scan = relaxed_order`), Drizzle ORM
* **AI & Machine Learning:**
  * **Semantic Embeddings:** Python FastAPI + `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (384-dim)
  * **Conversational Agent:** Fine-tuned `Qwen/Qwen2.5-7B-Instruct` + 4-bit QLoRA (`r=16`, `lora_alpha=32`), served via HuggingFace `transformers` + `peft`, `vLLM` (`merged_bf16`), or `Ollama` (`GGUF Q4_K_M`)
* **Quality Assurance:** Vitest (Unit & Integration test suites), ESLint, TypeScript strict typechecking

---

## End-to-End Setup Guide (Base App + 3 AI Deployment Modes)

### Part A: Base Application, Database & CPU Embedding Service

Run these steps once to initialize PostgreSQL (`pgvector`), seed the 7,000 kos dataset, and index all 384-dim embeddings.

#### 1. Install Dependencies & Configure Environment
```bash
git clone <repository-url>
cd kosera-spk
npm install
cp .env.example .env.local
```

Ensure the core variables in `.env.local` are configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
POSTGRES_DB=kosera
POSTGRES_USER=kosera
POSTGRES_PASSWORD=kosera123
DATABASE_URL=postgresql://kosera:kosera123@localhost:5434/kosera
JWT_SECRET=replace-with-a-secure-64-char-random-secret-key
AI_SERVICE_URL=http://localhost:8000
```

#### 2. Start PostgreSQL 16 (`pgvector`) & Apply Migrations
```bash
docker compose up -d db
npm run db:push
psql "postgresql://kosera:kosera123@localhost:5434/kosera" -f migrations/0009_add_mamikos_kos_fields_and_hnsw.sql
psql "postgresql://kosera:kosera123@localhost:5434/kosera" -f migrations/0010_add_chat_feedback.sql
```

#### 3. Seed Kos Listings & Local Photos
```bash
npm run db:seed
npm run db:seed-mamikos
npm run db:seed-photos
```

#### 4. Start the CPU Embedding Service (Port `8000`) & Index Vectors
Run via Docker Compose:
```bash
docker compose up -d ai-service
```
Or run natively with Python:
```bash
cd ai-service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```
Once `curl http://localhost:8000/health` reports `"ready": true`, index all kos embeddings:
```bash
npm run ai:index
```

---

### Part B: Choose Your AI Setup Mode (Offline, Hybrid, or Online)

You can run Kosera SPK in three different topologies depending on your hardware and deployment target:

| Component / Variable | Mode 1: Offline (100% Local) | Mode 2: Hybrid (Local + Colab GPU) | Mode 3: Online (100% Cloud Production) |
| :--- | :--- | :--- | :--- |
| **PostgreSQL (`pgvector`)** | Local Docker (`localhost:5434`) | Local Docker (`localhost:5434`) | Managed Cloud PostgreSQL (`pgvector`) |
| **Embedding Service** | Local (`http://localhost:8000`) | Local (`http://localhost:8000`) | Cloud CPU Container (`https://...`) |
| **LLM Inference Server** | Local **Ollama** (`GGUF Q4_K_M`, ~4.5 GB) | Remote **Colab Pro GPU** (`L4`/`A100`) + Cloudflare Tunnel | Persistent Cloud GPU **vLLM** (`merged_bf16`) |
| **`LLM_PROVIDER`** | `openai-compatible` | `colab-fastapi` | `openai-compatible` |
| **`LLM_SERVICE_URL`** | `http://localhost:11434` | `https://<tunnel>.trycloudflare.com` | `https://<your-vllm-gpu-host>` |
| **`LLM_MODEL_NAME`** | `kosera-spk` | *(unused by colab-fastapi)* | `kosera-qwen2.5-7b` |
| **`LLM_API_KEY`** | *(empty / optional)* | Colab `LLM_API_KEY` | vLLM `--api-key` secret |

---

#### Mode 1: Offline Setup (100% Local with Ollama GGUF)
Runs the entire stack on your local machine without internet or cloud GPUs.

1. Place `kosera-qwen2.5-7b-q4_k_m.gguf` and `Modelfile` (exported by `kosera-ai-service/notebooks/phase7_export_model.ipynb`) in `kosera-ai-service/outputs-phase-7/gguf/`.
2. Register the model in local [Ollama](https://ollama.com):
   ```bash
   cd ../kosera-ai-service/outputs-phase-7/gguf
   ollama create kosera-spk -f Modelfile
   ```
3. Set in `kosera-spk/.env.local`:
   ```env
   AI_SERVICE_URL=http://localhost:8000
   LLM_PROVIDER=openai-compatible
   LLM_SERVICE_URL=http://localhost:11434
   LLM_MODEL_NAME=kosera-spk
   ```
4. Start the web app:
   ```bash
   npm run dev
   ```

---

#### Mode 2: Hybrid Setup (Local App + Remote Google Colab Pro GPU)
Runs PostgreSQL, the CPU embedding service, and Next.js locally while offloading the 7B LLM to a Google Colab Pro `NVIDIA L4` or `A100` GPU.

1. Open `kosera-ai-service/notebooks/phase6_serve_colab.ipynb` in Google Colab Pro (`L4` or `A100` GPU) with `kosera-ai-service` mounted at `/content/drive/MyDrive/kosera-ai-service`.
2. Run **Cells 1–4** to launch `uvicorn server.chat_app:app` (`bfloat16` merged LoRA) on port `8001` and open a public `https://*.trycloudflare.com` tunnel.
3. Copy the printed `LLM_SERVICE_URL` and `LLM_API_KEY` into `kosera-spk/.env.local`:
   ```env
   AI_SERVICE_URL=http://localhost:8000
   LLM_PROVIDER=colab-fastapi
   LLM_SERVICE_URL=https://your-generated-tunnel.trycloudflare.com
   LLM_API_KEY=kosera-llm-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Start or restart Next.js:
   ```bash
   npm run dev
   ```

---

#### Mode 3: Online Setup (100% Cloud / Persistent Production)
Deploys every service for 24/7 production operation without relying on local machines or ephemeral Colab sessions.

1. **Cloud Database:** Provision PostgreSQL 16 with `pgvector` and apply all migrations.
2. **Cloud Embedding Service:** Deploy `./ai-service/Dockerfile` to a CPU container host (port `8000`) and set `AI_SERVICE_URL`.
3. **Persistent GPU `vLLM` Server:** On a cloud GPU instance (`>= 20 GB VRAM`), launch the merged `bfloat16` model (`outputs-phase-7/merged_bf16/`) using `kosera-ai-service/deploy/vllm_launch.sh`:
   ```bash
   MODEL_PATH=/path/to/outputs-phase-7/merged_bf16 \
   SERVED_MODEL_NAME=kosera-qwen2.5-7b \
   LLM_API_KEY=your-production-llm-secret \
   ./deploy/vllm_launch.sh
   ```
4. Configure production environment variables for Next.js:
   ```env
   AI_SERVICE_URL=https://embedding.yourdomain.com
   AI_API_KEY=your-embedding-secret
   LLM_PROVIDER=openai-compatible
   LLM_SERVICE_URL=https://llm.yourdomain.com
   LLM_MODEL_NAME=kosera-qwen2.5-7b
   LLM_API_KEY=your-production-llm-secret
   CHAT_FEEDBACK_SALT=your-production-random-salt
   ```
5. Build and launch Next.js:
   ```bash
   npm run build && npm run start
   ```

---

## Verification & Testing Commands

```bash
# Run TypeScript typecheck, ESLint, and Vitest unit tests (149 tests across 10 suites)
npm run typecheck
npm run lint
npm run test:unit

# Check live Embedding + LLM health status while Next.js is running
curl -s http://localhost:3000/api/ai/health | jq .
```

---

## Documentation Modules

- **[Complete AI & App Setup Guide (Offline, Hybrid, Online)](../kosera-ai-service/docs/SETUP_GUIDE.md)** — Full step-by-step installation, verification smoke tests, and troubleshooting.
- **[Dual Environment Setup Guide](./DUAL_ENVIRONMENT_SETUP.md)** — Running Kosera via Docker containers vs local host processes.
- **[Hybrid Recommendation & Profile Matching SPK](./blob/docs/implementation/profile-matching-spk.md)** — Mathematical formulation of Kusrini (2007) Profile Matching and AI Semantic Search blending.
- **[Database Design & Vector Search](./blob/docs/api/database-design.md)** — Drizzle ORM schema and `pgvector` HNSW index configuration.
- **[API Response Standardization](./blob/docs/api/response-standard.md)** — Standard API success/error envelope contract.
- **[Testing Strategy & CI/CD](./blob/docs/testing/TESTING_SUMMARY.md)** — Unit and integration testing guidelines.
