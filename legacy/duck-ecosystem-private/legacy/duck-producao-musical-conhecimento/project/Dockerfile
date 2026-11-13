# -----------------------------------------------------------------------------
# Dockerfile para Duck Produção Musical (Estilo Pirata / Autohospedado)
# Base: Nginx Alpine (ligero, seguro y de alto rendimiento)
# -----------------------------------------------------------------------------

# Etapa 1: Build de producción
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Etapa 2: Servidor web ultraligero
FROM nginx:alpine-slim
COPY --from=builder /app/dist/public /usr/share/nginx/html

# Configuración custom de Nginx para SPA (Single Page Application)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {\n\
        expires 30d;\n\
        add_header Cache-Control "public, no-transform";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
