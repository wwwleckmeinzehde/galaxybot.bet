# syntax=docker/dockerfile:1

# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies (use cache-friendly copy of manifests first)
COPY package.json ./
RUN npm install

# Copy source and build the static site
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config (fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Simple healthcheck for Coolify
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
