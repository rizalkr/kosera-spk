# KOSERA (Indekos Recommendation System Comparison)

KOSERA is a production-scale property management platform and boarding house (indekos) recommendation system. Beyond a conventional CRUD application, this system integrates a Decision Support System (DSS) and Artificial Intelligence (Semantic Search) utilizing a vector database to map user preferences with high precision.

This repository represents an isolated multi-tenant ecosystem with containerized infrastructure, covering the full lifecycle from search and transactional booking to analytical data visualization.

---

## Core Architecture & Hybrid Recommendation Engine

The system is designed with a strict separation of concerns, dividing business logic and authorization into a robust multi-tenant architecture, powered by a hybrid recommendation approach.

### Multi-Tenant Role-Based Access Control (RBAC)
1. **Admin Operations:** System-wide entity moderation, centralized platform analytics visualization, and data lifecycle management (soft delete, restore, permanent delete).
2. **Seller Center:** Dedicated operational dashboard for property owners, dynamic room inventory management, and transactional booking processing.
3. **Renter Experience:** Geospatial map integration, transactional reservation state machine, and a hybrid recommendation engine.

### Intelligent Hybrid Recommendation
To resolve the limitations of traditional search, the system implements a dual-algorithm approach:
* **Content-Based Filtering (CBF):** Calculates precise matching scores using the Profile Matching algorithm. It evaluates explicit user constraints such as budget limits, facility requirements, and specific room parameters against actual property data.
* **Semantic Search:** Utilizes multi-dimensional vector space (AI embeddings). By leveraging `pgvector`, the system analyzes the contextual and spatial proximity between properties, enabling fuzzy matching and semantic discovery that strict keyword searches cannot achieve.

---

## Technology Stack & Infrastructure

The repository is built on a modern, type-safe, and highly scalable stack:

* **Core Framework:** Next.js (App Router), Node.js, React
* **Database & ORM:** PostgreSQL optimized with `pgvector` extension, Drizzle ORM
* **Asset Orchestration:** Cloudinary API for optimized image delivery
* **DevOps & Infrastructure:** Docker, Docker Compose, GitHub Actions for CI/CD pipelines
* **Quality Assurance:** Vitest for Unit & Integration Testing, Husky (Pre-push hooks), ESLint
* **Data Visualization:** Chart.js for dashboard analytics

---

## Documentation Modules

To maintain a concise main README, detailed technical documentation has been modularized. Please review the following links for specific implementations:

### Core Logic & API
- **[Hybrid Recommendation & Algorithms](./blob/docs/implementation/profile-matching-spk.md)**
  *Mathematical comparison of Content-Based Filtering vs Semantic Search.*
- **[Database Design & Vector Search](./blob/docs/api/database-design.md)**
  *Drizzle ORM relational schema mapping and spatial vector index configurations.*
- **[API Design & Response Standardization](./blob/docs/api/response-standard.md)**
  *Implementation of the Envelope pattern to ensure consistent payloads.*

### Infrastructure & Deployment
- **[Dual Environment Setup Guide](./DUAL_ENVIRONMENT_SETUP.md)**
  *Directives for running the system via Docker containers or local host processes.*
- **[Deployment Architecture Guide](./blob/docs/deployment/vercel-huggingface-guide.md)**
  *Production deployment configurations for Vercel and HuggingFace Spaces.*
- **[Cloudinary Integration](./blob/docs/cloudinary/cloudinary-integration.md)**
  *Asset management and optimization workflows.*

### Quality Assurance
- **[Testing Strategy & CI/CD](./blob/docs/testing/TESTING_SUMMARY.md)**
  *Database state isolation using the Factory pattern and automated CI/CD workflows.*

---

## Local Development & Setup

This platform is configured to execute deterministically using containers. Ensure Docker and Docker Compose are installed on the host machine before proceeding.

### 1. Environment Initialization
Clone the repository and configure the environment variables based on the provided templates.
```bash
git clone <repository-url>
cd kosera-spk
cp .env.example .env.local
cp .env.docker .env
```
*(Note: Configure `DATABASE_URL`, `JWT_SECRET`, `AI_SERVICE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` before proceeding.)*

### 2. Build & Deploy Containers
Execute Docker orchestration to isolate the development environment.
```bash
npm run docker:dev:detach
```

### 3. Schema Migration & Vector Seeding
Once the database container is operational, run the Drizzle schema migration and inject the initial seed data.
```bash
npm run db:push
npm run db:seed
# Optional: To generate vector representations for the complete dataset
npx tsx scripts/index-embeddings.ts 
```

For detailed instructions on running without Docker or executing test suites, refer to the **[Dual Environment Setup Guide](./DUAL_ENVIRONMENT_SETUP.md)**.