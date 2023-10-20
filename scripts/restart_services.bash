#!/bin/bash
svcname=$1

eval $(minikube -p minikube docker-env)

ID=$(docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep "taxi/$svcname latest" | awk '{print $1}')

if [ "$svcname" != "usermgmt" ]
then
    make build-$svcname

else
    cargo sqlx prepare --workspace
fi

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