#!/bin/bash
DOCKER_NAME=$1

if [ -z "$DOCKER_NAME" ]
then
    echo "No docker name provided"
    exit 0
fi

docker tag $DOCKER_NAME registry.digitalocean.com/$DOCKER_NAME
docker push registry.digitalocean.com/$DOCKER_NAME