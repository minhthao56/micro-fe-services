# Final production image
FROM node:18-alpine

WORKDIR /app

COPY tmp/node_modules node_modules
COPY tmp/libs/ts libs/ts
COPY tmp/services/address services/address
COPY tmp/package.json package.json

EXPOSE 5050

CMD ["node", "services/address/dist"]