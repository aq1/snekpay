FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile
RUN yarn build

USER node:node

CMD ["node","-r dotenv/config build"]
