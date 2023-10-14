# Final production image
FROM node:18-alpine

WORKDIR /app

COPY node_modules node_modules
COPY libs/ts libs/ts
COPY services/communicate services/communicate
COPY package.json package.json
COPY tsconfig.base.json tsconfig.base.json

EXPOSE 7070

CMD ["node", "services/communicate/dist"]