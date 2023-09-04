#!/bin/bash
minikube start

minikube addons enable ingress

eval $(minikube -p minikube docker-env)

make build-communicatemgmt
make docker-communicatemgmt

# make build-usermgmt
make docker-usermgmt

make build-authmgmt
make docker-authmgmt

make build-ordermgmt
make docker-ordermgmt

make build-migration
make docker-migration



kubectl apply -f deployment/postgresql/pg-secret.yml

kubectl apply -f deployment/postgresql/pg-deploy-service.yml

./scripts/wait_for_pod.bash

kubectl apply -f deployment/postgresql/pg-configmap.yml

kubectl apply -f deployment/communicatemgmt/commu-deploy-service.yml

kubectl apply -f deployment/usermgmt/usermgmt-deploy-service.yml

kubectl apply -f deployment/authmgmt/authmgmt-deploy-service.yml

kubectl apply -f deployment/ordermgmt/ordermgmt-deploy-service.yml

kubectl apply -f deployment/common/common-configmap.yml

kubectl apply -f deployment/ingress/default-ingress.yml

kubectl apply -f deployment/jobs/migration-db.yaml

