FROM node:22-alpine AS development

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY --from=development . .

RUN npm run build

FROM nginx:latest AS production

ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]