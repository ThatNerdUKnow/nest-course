FROM node:16-alpine

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nest build --webpack

CMD [ "npm","run","start:prod" ]

