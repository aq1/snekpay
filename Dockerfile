FROM --platform=linux/amd64 node:16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte

COPY --chown=svelte:nodejs . .

USER svelte

CMD ["node", "-r", "dotenv/config", "build"]
