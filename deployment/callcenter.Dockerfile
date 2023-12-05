FROM nginx:alpine

WORKDIR /app

COPY deployment/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY clients/call-center/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]