#!/bin/bash
SVC_NAME=$1

if [ -z "$SVC_NAME" ]
then
    echo "No service name provided."
    exit 0
fi

docker rmi minhthao56/$SVC_NAME

docker rmi taxi/$SVC_NAME

make build-$SVC_NAME

make docker-$SVC_NAME

scripts/push_register.bash $SVC_NAME

kubectl config use-context do-sfo3-k8s-1-28-2-do-0-sfo3-1697898788911

kubectl rollout restart deployment $SVC_NAME

kubectl rollout status deployment $SVC_NAME

kubectl config use-context minikube