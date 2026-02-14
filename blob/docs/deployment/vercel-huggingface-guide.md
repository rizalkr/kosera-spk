# Deployment Guide: Vercel + HuggingFace Spaces

## Arsitektur

```
┌─────────────────────┐         ┌─────────────────────┐
│      VERCEL         │         │  HUGGINGFACE SPACES │
│   (Next.js App)     │◄───────►│   (AI Service)      │
│                     │  HTTPS  │                     │
│ - Frontend          │         │ - FastAPI           │
│ - API Routes        │         │ - Sentence Trans.   │
│ - Profile Matching  │         │ - Text Embedding    │
└─────────────────────┘         └─────────────────────┘
         │                               │
         │                               │
         ▼                               │
┌─────────────────────┐                  │
│   PostgreSQL        │◄─────────────────┘
│  (Supabase/Neon)    │    (Tidak langsung,
│  + pgvector         │     via Vercel API)
└─────────────────────┘
```

---

## 1. Deploy AI Service ke HuggingFace Spaces

### Langkah 1: Buat Repository di HuggingFace

1. Buka https://huggingface.co/spaces
2. Klik "Create new Space"
3. Settings:
   - **Space name**: `kosera-ai-service`
   - **SDK**: Docker
   - **Hardware**: CPU Basic (gratis) atau GPU jika perlu
   - **Visibility**: Public (gratis) atau Private

### Langkah 2: Upload AI Service

```bash
# Clone HuggingFace repo
git clone https://huggingface.co/spaces/YOUR_USERNAME/kosera-ai-service
cd kosera-ai-service

# Copy ai-service files
cp -r /path/to/kosera-spk/ai-service/* .

# Pastikan README.md punya metadata HF
cat README.md
# Harus ada:
# ---
# title: Kosera AI Service
# sdk: docker
# app_port: 7860
# ---

# Push ke HuggingFace
git add .
git commit -m "Initial deploy"
git push
```

### Langkah 3: Verifikasi

- Tunggu build selesai (~5-10 menit pertama kali, download model ~500MB)
- Akses: `https://YOUR_USERNAME-kosera-ai-service.hf.space`
- Test health: `https://YOUR_USERNAME-kosera-ai-service.hf.space/health`

---

## 2. Deploy Next.js ke Vercel

### Langkah 1: Environment Variables

Di Vercel Dashboard, set environment variables:

```env
# Database (Supabase/Neon with pgvector)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# AI Service URL (HuggingFace Spaces)
AI_SERVICE_URL=https://YOUR_USERNAME-kosera-ai-service.hf.space

# Cloudinary (jika digunakan)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Langkah 2: Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /path/to/kosera-spk
vercel

# Atau connect repo di Vercel Dashboard
```

### Langkah 3: Verifikasi

- Akses app di `https://your-app.vercel.app`
- Test AI health: `https://your-app.vercel.app/api/ai/health`

---

## 3. Konfigurasi CORS (Penting!)

AI Service perlu allow requests dari Vercel domain.

File `ai-service/main.py` sudah dikonfigurasi, tapi pastikan:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://your-domain.com",  # Domain custom jika ada
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 4. Database dengan pgvector

### Opsi A: Supabase (Recommended)

1. Buat project di https://supabase.com
2. Enable pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Run migrations dari `drizzle/` folder
4. Copy connection string ke `DATABASE_URL`

### Opsi B: Neon

1. Buat project di https://neon.tech
2. Enable pgvector (sudah default)
3. Run migrations
4. Copy connection string

---

## 5. Testing End-to-End

### Test AI Service langsung:

```bash
# Health check
curl https://YOUR_USERNAME-kosera-ai-service.hf.space/health

# Test vectorize
curl -X POST https://YOUR_USERNAME-kosera-ai-service.hf.space/vectorize \
  -H "Content-Type: application/json" \
  -d '{"text": "kos murah dekat kampus"}'
```

### Test via Vercel App:

```bash
# AI health via Next.js
curl https://your-app.vercel.app/api/ai/health

# Semantic search
curl -X POST https://your-app.vercel.app/api/kos/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query": "kos nyaman dengan wifi cepat", "limit": 5}'
```

---

## 6. Troubleshooting

### HuggingFace Space tidak start

- Cek logs di HuggingFace Dashboard
- Pastikan `app_port: 7860` di README.md
- Pastikan Dockerfile pakai USER non-root

### AI Service timeout di Vercel

- HuggingFace Spaces gratis bisa sleep setelah idle
- Cold start bisa 30-60 detik
- Solusi: Upgrade ke HF Pro atau buat cron job untuk keep-alive

### CORS error

- Pastikan domain Vercel ada di `allow_origins`
- Check browser console untuk detail error

### Embedding tidak tersimpan

- Pastikan pgvector extension enabled
- Run: `CREATE EXTENSION IF NOT EXISTS vector;`
- Cek kolom `embedding` di tabel `kos`

---

## 7. Biaya

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | 100GB bandwidth/bulan | $20/bulan |
| HuggingFace Spaces | CPU Basic | $9/bulan (GPU) |
| Supabase | 500MB database | $25/bulan |
| Neon | 512MB database | $19/bulan |

**Estimasi production minimal: $0 - $25/bulan**
