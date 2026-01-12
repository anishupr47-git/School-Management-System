FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm ci --only=development

COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;
  client_max_body_size 20M;

  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/plain text/css text/javascript application/javascript;

  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "public, max-age=0";
  }

  location ~* ^.+\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  location /static/ {
    proxy_pass http://backend:8000/static/;
    add_header Cache-Control "public, max-age=31536000";
  }

  location /media/ {
    proxy_pass http://backend:8000/media/;
    add_header Cache-Control "public, max-age=31536000";
  }
}
EOF

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost/index.html || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
