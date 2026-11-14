# Docker Setup Guide for Kosera API

This guide explains how to set up and run Kosera API using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.x+
- Docker Compose v2.x+
- Git

## Quick Start

### Development Environment

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd kosera-spk
   ```

2. **Copy environment files**
   ```bash
   cp .env.docker .env
   cp .env.example .env.local
   ```

3. **Start development environment**
   ```bash
   npm run docker:dev
   ```

4. **Access the application**
   - API / Web: http://localhost:3000
   - Health Check: http://localhost:3000/api/health
   - pgAdmin: http://localhost:5050 (admin@kosera.com / admin123)

### Production Environment

1. **Set production environment variables**
   ```bash
   cp .env.docker .env.production
   # Edit .env.production with production values
   ```

2. **Start production environment**
   ```bash
   docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
   ```

## Available Docker Commands

### Development Commands

```bash
# Start development environment
npm run docker:dev

# Start in detached mode (background)
npm run docker:dev:detach

# Stop development environment
npm run docker:dev:down

# Clean up (remove volumes and orphans)
npm run docker:dev:clean
```

### Production Commands

```bash
# Start production environment
npm run docker:prod

# Start in detached mode
npm run docker:prod:detach

# Stop production environment
npm run docker:prod:down
```

## Docker Architecture

### Services

1. **app** - Next.js application
   - Development: Hot reload enabled
   - Production: Standalone Next.js build
   - Port: 3000

2. **db** - PostgreSQL database with pgvector
   - Image: `pgvector/pgvector:pg16`
   - Container port: 5432 (exposed on host port 5434 in dev, 5433 for `db_test`)
   - Persistent data storage

3. **pgadmin** - Database management UI (development only)
   - Port: 5050
   - Web-based database administration

4. **nginx** - Reverse proxy (production only)
   - Port: 80/443

### Volumes

- `postgres_data` - Database persistent storage
- `postgres_test_data` - Test database persistent storage
- `pgadmin_data` - pgAdmin configuration storage

### Networks

- `kosera-network` - Internal bridge network for service communication

## Database Operations

```bash
# Push schema inside running container
npm run docker:db:push

# Run migrations inside running container
npm run docker:db:migrate

# Seed database inside running container
npm run docker:db:seed

# Access psql directly
docker compose exec db psql -U kosera -d kosera
```

## Health Checks

```bash
# Check service health
npm run docker:status

# Test API health endpoint
curl http://localhost:3000/api/health
```
