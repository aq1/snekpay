FROM --platform=linux/amd64 node:16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte

COPY --chown=svelte:nodejs node_modules ./
COPY --chown=svelte:nodejs static ./
COPY --chown=svelte:nodejs package.json ./
COPY --chown=svelte:nodejs build/ ./

USER svelte

CMD ["node", "-r", "dotenv/config", "build"]
