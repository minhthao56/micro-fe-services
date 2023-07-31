FROM node:18-alpine

WORKDIR /app

COPY services/communicatemgmt/package.json ./

COPY build/node_modules ./node_modules

COPY build/dist ./dist

EXPOSE 7070

CMD ["node", "dist/main"]