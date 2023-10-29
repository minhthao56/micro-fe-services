#!/bin/bash

make build-migration

make docker-migration

scripts/push_register.bash migration-db

kubectl config use-context do-sfo3-k8s-1-28-2-do-0-sfo3-1697898788911

kubectl delete job migration-db

kubectl apply -f deployment/digitalocean/jobs/migration-db.yaml

kubectl config use-context minikube