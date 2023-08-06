FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile
RUN yarn build

USER node:node

HEALTHCHECK CMD curl --fail http://localhost:3000/api/health || exit 1

CMD ["node","build"]
