#!/bin/bash
svcname=$1

make build-$svcname

eval $(minikube -p minikube docker-env)

ID=$(docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep "taxi/$svcname latest" | awk '{print $1}')

make docker-$svcname

kubectl rollout restart deployment $svcname

kubectl rollout status deployment $svcname

sleep 60

if [ -z "$ID" ]
then
    echo "No image found"
    exit 0
fi

docker rmi -f $ID