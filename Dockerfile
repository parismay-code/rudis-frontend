FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

FROM development AS build

WORKDIR /usr/src/app

RUN npm run build

FROM nginx:alpine AS production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf