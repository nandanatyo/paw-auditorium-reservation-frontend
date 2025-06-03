FROM node:23-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npx vite build

CMD [ "serve", "-s", "dist" ]
