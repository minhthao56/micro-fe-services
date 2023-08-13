#!/bin/bash
eval $(minikube -p minikube docker-env)

ID=$(docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep "taxi/communicatemgmt latest" | awk '{print $1}')

make build-communicatemgmt

make docker-communicatemgmt

kubectl rollout restart deployment communicatemgmt

kubectl rollout status deployment communicatemgmt

sleep 60

docker rmi -f $ID