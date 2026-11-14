# Dual Environment Setup Guide

## Overview
The Kosera project is architected to operate across two distinct runtime environments:
1. Local Development - Utilizing a host-level PostgreSQL service.
2. Docker Environment - Utilizing isolated Docker containers for full stack execution.

## Environment Configurations

### 1. Local Development: `.env.local`
```bash
# Host-level database connection (5434 for Docker DB, 5432 for native PostgreSQL)
DATABASE_URL=postgresql://kosera:kosera123@localhost:5434/kosera
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Docker Environment: `.env.docker` (copied to `.env` for Compose)
```bash
# Container-level database connection (resolving to 'db' hostname)
DATABASE_URL=postgresql://kosera:kosera123@db:5432/kosera
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Production Database Scripts: `.env.production`
```bash
# Used by npm run db:*:prod scripts
DATABASE_URL=postgresql://user:password@production-host:5432/postgres
```

## Command Line Interface (CLI) Directives

### Local Development Commands
Execute these commands when operating on the host machine with a native PostgreSQL installation:

```bash
# Database Operations
npm run db:generate      # Generate Drizzle migration payloads
npm run db:migrate       # Apply migrations to local DB
npm run db:push          # Force schema synchronization to local DB
npm run db:studio        # Initialize Drizzle Studio interface
npm run db:seed          # Inject standard baseline data
npm run db:seed-photos   # Inject mock media assets

# Application Runtime
npm run dev              # Initialize Next.js development server

# Quality Assurance
npm run test             # Execute complete test suite
npm run test:unit        # Execute isolated unit tests
npm run test:integration # Execute integration tests requiring local DB
```

### Docker Environment Commands
Execute these commands when utilizing containerized orchestration:

```bash
# Database Operations (executed inside the container)
npm run docker:db:generate     # Generate migration payloads within container
npm run docker:db:migrate      # Apply migrations to containerized DB
npm run docker:db:push         # Force schema synchronization to containerized DB
npm run docker:db:studio       # Initialize Drizzle Studio for containerized DB
npm run docker:db:seed         # Inject baseline data into containerized DB
npm run docker:db:seed-photos  # Inject media assets into containerized DB

# Container Orchestration
npm run docker:dev          # Build and attach containers
npm run docker:dev:detach   # Build and detach containers (daemon mode)
npm run docker:dev:down     # Terminate all containers
npm run docker:dev:clean    # Terminate containers and purge volume persistence

# Quality Assurance (executed inside the container)
npm run docker:test            # Execute complete test suite inside container
npm run docker:test:unit       # Execute unit tests inside container
npm run docker:test:integration # Execute integration tests inside container
```

## Setup Protocol

### Local Development Setup

1. Install PostgreSQL on the host machine.
2. Initialize database and role privileges:
   ```sql
   sudo -u postgres psql
   CREATE USER kosera WITH PASSWORD 'kosera123';
   CREATE DATABASE kosera OWNER kosera;
   GRANT ALL PRIVILEGES ON DATABASE kosera TO kosera;
   ```
3. Resolve dependencies: `npm install`
4. Apply relational schema: `npm run db:migrate`
5. Optional data injection: `npm run db:seed`
6. Initialize runtime: `npm run dev`

### Docker Environment Setup

1. Ensure Docker Engine and Docker Compose are active on the host daemon.
2. Duplicate `.env.docker` parameters to standard `.env` if required by docker-compose context.
3. Initialize orchestration: `npm run docker:dev`
   *(Note: Container initialization automatically applies Drizzle migrations)*

## System Mechanics

### Deterministic Environment Detection
The `drizzle.config.ts` file and standalone CLI scripts implement a deterministic fallback order:
1. Primary resolution: `.env.local` (Local configuration)
2. Fallback resolution: `.env` (Docker / default configuration)
3. Production DB scripts (`npm run db:*:prod`): explicitly load `.env.production`
4. Test runner (`tests/setup/env.ts`): loads `.env.test`, then `.env.local`, then `.env`

## Troubleshooting Protocol

* **Error: "getaddrinfo EAI_AGAIN db"**
  * Cause: Attempting to execute a local command (`npm run db:*`) while the loaded configuration points to a Docker hostname.
  * Resolution: Ensure parity between the environment file and the executed command prefix.
* **Error: "Connection refused localhost:5432"**
  * Cause: Host PostgreSQL daemon is inactive or not installed.
  * Resolution: Start the local service (`systemctl start postgresql`) or switch to the Docker environment.

## Infrastructure Validation

### Local Validation
```bash
# Validate schema synchronization status
npm run db:generate
# Expected standard output: "No schema changes, nothing to migrate"
```

### Docker Validation
```bash
# Deploy background daemon
npm run docker:dev:detach

# Validate container runtime logs
docker logs kosera-app
docker logs kosera-db

# Terminate infrastructure
npm run docker:dev:down
```