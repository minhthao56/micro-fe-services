#!/bin/bash
DOCKER_NAME=$1

if [ -z "$DOCKER_NAME" ]
then
    echo "No docker name provided locally."
    exit 0
fi

docker tag taxi/$DOCKER_NAME minhthao56/$DOCKER_NAME
docker push minhthao56/$DOCKER_NAME