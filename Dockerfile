FROM node:alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn add global @nestjs/cli
RUN yarn
COPY . .
RUN yarn run build

EXPOSE 4000

CMD ["node", "dist/main"]
