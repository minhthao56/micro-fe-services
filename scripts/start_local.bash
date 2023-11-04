#!/bin/bash
minikube start
minikube addons enable ingress

eval $(minikube -p minikube docker-env)

make build-communicate
make docker-communicate

make build-usermgmtsk
make docker-usermgmt

make build-authmgmt
make docker-authmgmt

make build-booking
make docker-booking

make build-migration
make docker-migration



kubectl apply -f deployment/postgresql/pg-secret.yml

kubectl apply -f deployment/postgresql/pg-deploy-service.yml

./scripts/wait_for_pod.bash

kubectl apply -f deployment/postgresql/pg-configmap.yml

kubectl apply -f deployment/local/communicate/commu-deploy-service.yml

kubectl apply -f deployment/local/usermgmt/usermgmt-deploy-service.yml

kubectl apply -f deployment/local/authmgmt/authmgmt-deploy-service.yml

kubectl apply -f deployment/local/booking/booking-deploy-service.yml

kubectl apply -f deployment/common/common-configmap.yml

kubectl apply -f deployment/config/firebase.yml

kubectl apply -f deployment/local/ingress/default-ingress.yml

kubectl apply -f deployment/local/jobs/migration-db.yaml