FROM alpine:3.16.2

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache nodejs npm

COPY package*.json .

RUN npm install

COPY . .