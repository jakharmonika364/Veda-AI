FROM node:20-slim

# Chromium for Puppeteer PDF generation
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnspr4 \
    libnss3 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

# Install dependencies (layered for cache efficiency)
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/
RUN npm ci --workspace=@vedaai/server --workspace=@vedaai/shared --include-workspace-root

# Build shared package first (server depends on it)
COPY packages/shared/ ./packages/shared/
RUN npm run build --workspace=@vedaai/shared

# Build server
COPY apps/server/ ./apps/server/
RUN npm run build --workspace=@vedaai/server

WORKDIR /app/apps/server

EXPOSE 4000

CMD ["node", "dist/index.js"]
