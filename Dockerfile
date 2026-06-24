# syntax=docker/dockerfile:1

# --- Build stage: install all deps and build the static frontend ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# --- Runtime stage: Node server serves the built SPA + the betting API ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Only production dependencies (express) for a lean image
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# App: the built frontend and the server
COPY --from=build /app/dist ./dist
COPY server ./server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server/index.js"]
