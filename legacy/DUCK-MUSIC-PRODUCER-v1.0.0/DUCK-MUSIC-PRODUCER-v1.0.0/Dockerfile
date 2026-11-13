FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates bash \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production MANOS_CHROMIUM_PATH=/usr/bin/chromium
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm check && pnpm duck:build
EXPOSE 4200
CMD ["node", "dist-duck/api-cli.js"]
