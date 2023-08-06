FROM node:18-alpine AS external-website

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile

RUN yarn build

RUN rm -rf src/ static/ emailTemplates/

USER node:node

CMD ["node","-r dotenv/config build"]