#!/bin/bash
svcname=$1

eval $(minikube -p minikube docker-env)

ID=$(docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep "taxi/$svcname latest" | awk '{print $1}')

make build-$svcname

make docker-$svcname

kubectl rollout restart deployment $svcname

kubectl rollout status deployment $svcname

sleep 60

docker rmi -f $ID