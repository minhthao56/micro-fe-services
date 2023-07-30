FROM node:18-alpine

WORKDIR /app

COPY services/communicatemgmt/package.json ./

RUN npm install --only=production

COPY build/dist ./dist

EXPOSE 7070

CMD ["node", "dist/main"]