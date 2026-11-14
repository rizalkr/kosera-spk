# Kosera API Dockerfile (Revisi)
# Multi-stage build for development and production

# =============================================
# Base/Builder Stage
# Menggunakan 'slim' yang berbasis Debian (glibc) untuk kompatibilitas
# =============================================
FROM node:22-slim AS builder
WORKDIR /app

# Copy package files dan install semua dependensi
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sisa source code
COPY . .

# Build aplikasi untuk production
RUN npm run build

# =============================================
# Development Stage
# Stage ini hanya akan digunakan saat menjalankan 'docker compose up'
# =============================================
FROM node:22-slim AS dev
WORKDIR /app

# Copy package files dan install semua dependensi (termasuk devDependencies)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sisa source code
COPY . .

# Port default Next.js
EXPOSE 3000

# Perintah untuk memulai server development
CMD ["npm", "run", "dev"]

# =============================================
# Production Stage
# Stage final yang ramping untuk deployment
# =============================================
FROM node:22-slim AS production
WORKDIR /app

# Buat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy hanya file yang dibutuhkan dari builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Jika ada file lain yang dibutuhkan, copy di sini
# COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000

# Perintah untuk menjalankan aplikasi production
CMD ["node", "server.js"]
