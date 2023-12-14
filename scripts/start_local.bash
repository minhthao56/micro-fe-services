#!/bin/bash
set -e


make build-communicate

make build-usermgmt

make build-authmgmt

make build-booking

make build-migration

minikube start

minikube addons enable ingress

eval $(minikube -p minikube docker-env)

make docker-communicate

make docker-usermgmt

make docker-authmgmt

make docker-booking

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

kubectl apply -f deployment/config/twilio.yml

kubectl apply -f deployment/local/ingress/default-ingress.yml

kubectl apply -f deployment/local/jobs/migration-db.yaml