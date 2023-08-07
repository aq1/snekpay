FROM --platform=linux/amd64 node:16-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

COPY prisma ./
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

FROM --platform=linux/amd64 node:16-alpine3.17 AS builder
WORKDIR /app
ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build
# to clean dev dependencies after build
RUN yarn --frozen-lockfile

FROM --platform=linux/amd64 node:16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte

COPY --from=builder --chown=svelte:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=svelte:nodejs /app/static ./static
COPY --from=builder --chown=svelte:nodejs /app/package.json ./package.json
COPY --from=builder --chown=svelte:nodejs /app/build/ ./build

USER svelte

CMD ["node", "-r", "dotenv/config", "build"]
