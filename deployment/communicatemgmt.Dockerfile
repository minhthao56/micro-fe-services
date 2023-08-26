# FROM node:18-alpine

# WORKDIR /app

# COPY libs/ts libs/ts

# COPY services/communicatemgmt services/communicatemgmt

# COPY  package.json package.json

# COPY pnpm-workspace.yaml pnpm-workspace.yaml

# RUN npm install -g pnpm

FROM node:18-alpine AS build

WORKDIR /app

RUN npm install --global pnpm
COPY node_modules node_modules
COPY libs/ts libs/ts
COPY services/communicatemgmt services/communicatemgmt
COPY  package.json package.json
COPY pnpm-workspace.yaml pnpm-workspace.yaml
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter communicatemgmt build 

# Deploy the production dependencies
FROM node:18-alpine AS pruned

WORKDIR /app
RUN npm install --global pnpm
COPY --from=build . .
RUN mkdir pruned && pnpm --filter communicatemgmt deploy --prod pruned

# Final production image
FROM node:18-alpine

WORKDIR /app

COPY --from=pruned /app/pruned/dist dist
COPY --from=pruned /app/pruned/node_modules node_modules

EXPOSE 7070

CMD ["node", "dist"]