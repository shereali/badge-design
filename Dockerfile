# Multi-stage production build for Nuxt 4 (Nitro Server)
FROM node:20-alpine AS builder
WORKDIR /app

# Prevent Out-Of-Memory during compilation
ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache dumb-init curl

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Graceful signal termination via dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]

