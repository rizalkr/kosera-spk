# pgvector Index Guide

Dokumentasi ini menjelaskan kapan dan bagaimana menggunakan index untuk vector search di PostgreSQL dengan pgvector.

## Overview

pgvector mendukung 2 jenis index untuk mempercepat similarity search:

| Index Type | Best For | Pros | Cons |
|------------|----------|------|------|
| **IVFFlat** | Dataset besar (> 10k rows) | Build time cepat, memory efficient | Perlu data banyak untuk efektif |
| **HNSW** | Dataset kecil-menengah (1k-50k rows) | Performa stabil, recall tinggi | Build time lebih lama, memory lebih besar |

## Kapan TIDAK Perlu Index

Untuk dataset kecil (< 2000 rows), **sequential scan tanpa index sudah sangat cepat** (< 10ms).

Index justru bisa memperlambat query untuk dataset kecil karena:
- Overhead index lookup
- Index IVFFlat membutuhkan clustering yang tidak efektif untuk data sedikit

**Rekomendasi untuk demo skripsi:** Jangan gunakan index jika data kos < 2000.

## Kapan Perlu Index

Gunakan index jika:
- Dataset > 2000 rows
- Query time mulai > 100ms
- Concurrent users banyak

## Cara Membuat Index

### Option A: HNSW (Recommended untuk production)

```sql
CREATE INDEX kos_embedding_hnsw_idx ON kos 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
```

Parameter:
- `m`: Jumlah koneksi per node (16-64, lebih tinggi = lebih akurat tapi lebih lambat build)
- `ef_construction`: Build-time search width (64-100)

### Option B: IVFFlat (Untuk dataset sangat besar)

```sql
CREATE INDEX kos_embedding_ivfflat_idx ON kos 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

Parameter:
- `lists`: Jumlah cluster (rule of thumb: sqrt(total_rows))

## Distance Operators

| Operator | Meaning | Use Case |
|----------|---------|----------|
| `<->` | L2 distance (Euclidean) | Default, general purpose |
| `<=>` | Cosine distance | Semantic similarity (RECOMMENDED) |
| `<#>` | Inner product | Normalized vectors |

## Query Example

```sql
-- Cosine similarity search (semakin kecil distance = semakin mirip)
SELECT 
  id, 
  name, 
  1 - (embedding <=> '[0.1, 0.2, ...]'::vector) as similarity_score
FROM kos
WHERE embedding IS NOT NULL
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

## Performance Benchmarks (Estimated)

| Rows | Without Index | With HNSW | With IVFFlat |
|------|---------------|-----------|--------------|
| 100 | ~1ms | ~2ms (overhead) | ~3ms (overhead) |
| 1,000 | ~5ms | ~2ms | ~3ms |
| 10,000 | ~50ms | ~3ms | ~5ms |
| 100,000 | ~500ms | ~5ms | ~10ms |

## References

- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [HNSW Paper](https://arxiv.org/abs/1603.09320)
- [IVFFlat Explained](https://www.pinecone.io/learn/ivf/)
