FROM node:18-alpine
RUN corepack enable && corepack prepare yarn@4.5.2 --activate
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 3000


CMD ["node", "index.js"]
