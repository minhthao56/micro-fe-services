#!/bin/bash

npx nx build communicate

SERVICE_PATH="tmp/services/communicate"
DB_PATH="tmp/libs/ts/database"
UTILS_PATH="tmp/libs/ts/utils"


if [ ! -d "$SERVICE_PATH" ]; then
  mkdir -p "$SERVICE_PATH"
fi

if [ ! -d "$DB_PATH" ]; then
  mkdir -p "$DB_PATH"
fi

if [ ! -d "$UTILS_PATH" ]; then
  mkdir -p "$UTILS_PATH"
fi

cp package.json tmp/package.json

for srcPaths in services/communicate/*; do
    cp -R "$srcPaths" "$SERVICE_PATH"
done

for srcPaths in libs/ts/database/*; do
    cp -R "$srcPaths" "$DB_PATH"
done

for srcPaths in libs/ts/utils/*; do
    cp -R "$srcPaths" "$UTILS_PATH"
done

cd tmp && yarn install --production=true