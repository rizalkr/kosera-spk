# AI-Enhanced Decision Support System

## Arsitektur dan Implementasi Algoritma Hybrid PM-SPK + Semantic Search

### Gambaran Umum

Sistem ini mengimplementasikan pendekatan hybrid yang menggabungkan algoritma Profile Matching (PM-SPK) dengan AI Semantic Search untuk menghasilkan rekomendasi kos yang lebih akurat dan kontekstual.

## Landasan Teori

### 1. Profile Matching (Kusrini, 2007)

Profile Matching adalah metode pengambilan keputusan yang membandingkan profil kandidat dengan profil ideal yang diharapkan. Dalam konteks ini:

- **Profil Ideal**: Preferensi user (budget, lokasi, fasilitas, rating minimum)
- **Profil Kandidat**: Data kos (harga, lokasi, fasilitas, rating)

Langkah-langkah algoritma:
1. Pemetaan kriteria ke dalam Core Factor (CF) dan Secondary Factor (SF)
2. Perhitungan Gap antara profil ideal dan kandidat
3. Pembobotan menggunakan metode ROC (Rank Order Centroid)
4. Perhitungan skor akhir

**Formula PM Score:**
```
PM_Score = (w_price * S_price) + (w_location * S_location) + 
           (w_facilities * S_facilities) + (w_rating * S_rating)
```

Dimana bobot default menggunakan ROC:
- w_price = 0.4 (Core Factor)
- w_location = 0.3 (Core Factor)
- w_facilities = 0.2 (Secondary Factor)
- w_rating = 0.1 (Secondary Factor)

### 2. Semantic Search dengan Vector Embeddings

Semantic Search memungkinkan pencarian berdasarkan makna, bukan hanya kecocokan kata kunci. Implementasi menggunakan:

**Model**: `paraphrase-multilingual-MiniLM-L12-v2`
- Dimensi: 384
- Mendukung 50+ bahasa termasuk Bahasa Indonesia
- Optimized untuk semantic similarity

**Proses:**
1. Teks kos dikonversi menjadi embedding vector
2. Query user dikonversi menjadi embedding vector
3. Cosine similarity dihitung antara query dan setiap kos
4. Hasil diurutkan berdasarkan similarity score

**Formula Cosine Similarity:**
```
similarity(A, B) = (A . B) / (||A|| * ||B||)
```

### 3. Hybrid Algorithm

Menggabungkan kedua pendekatan dengan weighted average:

**Formula Hybrid Score:**
```
Hybrid_Score = (w_pm * PM_Score) + (w_ai * AI_Score)
```

Dimana:
- `w_pm`: bobot Profile Matching (default 0.7)
- `w_ai`: bobot AI Semantic (default 0.3)
- `PM_Score`: skor Profile Matching [0-100]
- `AI_Score`: cosine similarity dinormalisasi ke [0-100]

**Justifikasi Pembobotan Default (0.7:0.3):**
- Profile Matching memberikan rekomendasi yang objektif berdasarkan kriteria terukur
- AI Semantic menambahkan konteks natural language yang subjektif
- Bobot 70:30 memastikan rekomendasi tetap berbasis data terukur namun diperkaya dengan pemahaman semantik

## Arsitektur Sistem

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Next.js App    |---->|   AI Service     |---->|   PostgreSQL     |
|   (TypeScript)   |     |   (Python/FastAPI)|    |   + pgvector     |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|  Hybrid          |     |  Sentence        |     |  Vector          |
|  Algorithm       |     |  Transformers    |     |  Embeddings      |
+------------------+     +------------------+     +------------------+
```

### Komponen:

1. **Next.js Application** (Port 3000)
   - API Routes untuk hybrid recommendations
   - Profile Matching algorithm implementation
   - AI service client

2. **Python AI Service** (Port 8000)
   - FastAPI untuk high-performance inference
   - Sentence Transformers untuk text embedding
   - Health check dengan model preloading

3. **PostgreSQL + pgvector** (Port 5432)
   - Penyimpanan data kos dan user preferences
   - Vector embeddings dalam kolom `embedding`
   - Efficient cosine distance queries

## Database Schema

### Kolom AI pada Tabel `kos`:

```sql
-- Full text description untuk embedding
description_full TEXT

-- Vector embedding (384 dimensi)
embedding vector(384)
```

### Index untuk Performance:

```sql
-- IVFFlat index untuk approximate nearest neighbor
CREATE INDEX ON kos 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## API Endpoints

### 1. Hybrid Recommendations

**POST** `/api/kos/hybrid-recommendations`

Request:
```json
{
  "query": "kos dekat kampus dengan wifi dan AC murah",
  "weightPM": 0.7,
  "weightAI": 0.3,
  "page": 1,
  "limit": 10,
  "minScore": 50
}
```

Response:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": 1,
        "name": "Kos Melati",
        "matchingScore": 85,
        "semanticScore": 72,
        "hybridScore": 81,
        "hybridDetails": {
          "profileMatchingScore": 85,
          "semanticSimilarityScore": 72,
          "weightPM": 0.7,
          "weightAI": 0.3
        }
      }
    ],
    "algorithmMode": "hybrid",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

### 2. Semantic Search

**POST** `/api/kos/semantic-search`

Request:
```json
{
  "query": "tempat tinggal nyaman untuk mahasiswa",
  "city": "Jakarta Selatan",
  "minPrice": 500000,
  "maxPrice": 2000000,
  "limit": 20
}
```

### 3. Similar Kos

**GET** `/api/kos/semantic-search?kosId=123&limit=10`

Mengembalikan kos yang mirip berdasarkan vector similarity.

### 4. Admin Indexing

**POST** `/api/admin/ai`

Trigger batch indexing untuk generate embeddings.

**GET** `/api/admin/ai`

Mendapatkan status AI service dan statistik indexing.

## Alur Proses

### 1. Indexing (Batch)

```
1. Admin trigger indexing via API
2. Fetch kos tanpa embedding dari database
3. Build rich text description untuk setiap kos
4. Kirim batch ke AI service untuk vectorization
5. Simpan embeddings ke database
6. Return summary (success/failed counts)
```

### 2. Hybrid Search (Runtime)

```
1. User submit query dengan preferences
2. Fetch user preferences dari database
3. Generate query embedding via AI service
4. Fetch eligible kos dengan embeddings
5. Calculate PM score untuk setiap kos
6. Calculate semantic similarity
7. Combine dengan weighted average
8. Sort dan paginate results
9. Return dengan detailed scoring breakdown
```

## Evaluasi dan Metrics

### Metrics yang Direkomendasikan:

1. **Precision@K**: Proporsi rekomendasi relevan dalam top-K
2. **Recall@K**: Proporsi item relevan yang ter-retrieve dalam top-K
3. **NDCG**: Normalized Discounted Cumulative Gain
4. **User Satisfaction**: A/B testing dengan user feedback

### Baseline Comparison:

| Metode | Precision@10 | Coverage | Diversity |
|--------|--------------|----------|-----------|
| PM-SPK Only | - | 100% | Low |
| Semantic Only | - | ~Indexed% | High |
| Hybrid (70:30) | - | ~Indexed% | Medium-High |

*Note: Nilai aktual perlu diisi berdasarkan hasil evaluasi*

## Referensi

1. Kusrini. (2007). *Konsep dan Aplikasi Sistem Pendukung Keputusan*. Andi Offset.
2. Burke, R. (2002). Hybrid Recommender Systems: Survey and Experiments. *User Modeling and User-Adapted Interaction*.
3. Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks. *EMNLP*.
4. Johnson, J., Douze, M., & Jegou, H. (2019). Billion-scale similarity search with GPUs. *IEEE Transactions on Big Data*.

## Catatan Implementasi

### Fallback Mechanism

Sistem memiliki fallback graceful:
- Jika AI service tidak tersedia, gunakan PM-SPK only
- Jika kos belum memiliki embedding, semantic score = 0
- Jika query kosong, mode otomatis PM-only

### Scalability

- Batch indexing mendukung hingga 500 kos per request
- pgvector IVFFlat index untuk sub-linear search time
- Model di-cache dalam memory untuk fast inference

### Security

- AI service hanya accessible dari internal network
- Admin endpoints protected dengan authentication
- Input validation pada semua API endpoints
