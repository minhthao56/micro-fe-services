#!/bin/bash

SERVICE=${1-'communicate'}

npx nx build $SERVICE

SERVICE_PATH="tmp/services/$SERVICE"
DB_PATH="tmp/libs/ts/database"
UTILS_PATH="tmp/libs/ts/utils"
SCHEMA_PATH="tmp/libs/ts/schema"


if [ ! -d "$SERVICE_PATH" ]; then
  mkdir -p "$SERVICE_PATH"
fi

if [ ! -d "$DB_PATH" ]; then
  mkdir -p "$DB_PATH"
fi

if [ ! -d "$UTILS_PATH" ]; then
  mkdir -p "$UTILS_PATH"
fi

if [ ! -d "$SCHEMA_PATH" ]; then
  mkdir -p "$SCHEMA_PATH"
fi

cp package.json tmp/package.json

for srcPaths in services/$SERVICE/*; do
    cp -R "$srcPaths" "$SERVICE_PATH"
done

for srcPaths in libs/ts/database/*; do
    cp -R "$srcPaths" "$DB_PATH"
done

for srcPaths in libs/ts/utils/*; do
    cp -R "$srcPaths" "$UTILS_PATH"
done

for srcPaths in libs/ts/schema/*; do
    cp -R "$srcPaths" "$SCHEMA_PATH"
done

cd tmp && yarn install --production=true && cd services/$SERVICE && yarn build