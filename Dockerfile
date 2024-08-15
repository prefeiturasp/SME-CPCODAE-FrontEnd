FROM node:22.6.0-bullseye AS builder

ARG ENVIRON

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build-${ENVIRON}

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/sme /usr/share/nginx/html
COPY --from=builder /app/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
