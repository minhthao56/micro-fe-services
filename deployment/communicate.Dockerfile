# Final production image
FROM node:18-alpine

WORKDIR /app

COPY tmp/node_modules node_modules
COPY tmp/libs/ts libs/ts
COPY tmp/services/communicate services/communicate
COPY tmp/package.json package.json

EXPOSE 7070

CMD ["node", "services/communicate/dist"]