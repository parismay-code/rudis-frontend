FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

FROM development AS build

WORKDIR /usr/src/app

RUN npm run build

FROM nginx:alpine AS production

RUN apk update && apk add openssl

RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2028 && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/certs/self.key -out /etc/ssl/certs/self.crt \
    -subj '/C=RU/ST=Moscow/L=Kremlin/O=Azzrael Code/OU=Org/CN=azz.code'

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl-params.conf /etc/nginx/ssl-params.conf