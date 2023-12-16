#!/bin/bash
set -e

make build-communicate

make build-usermgmt

make build-authmgmt

make build-booking

make build-address

make build-migration

minikube start

minikube addons enable ingress

eval $(minikube -p minikube docker-env)

make docker-communicate

make docker-usermgmt

make docker-authmgmt

make docker-booking

make docker-address

make docker-migration


# redis
kubectl apply -f deployment/redis/redis-doploy-serivce.yaml
kubectl apply -f deployment/redis/redis-configmap.yaml

# postgresql
kubectl apply -f deployment/postgresql/pg-secret.yml
kubectl apply -f deployment/postgresql/pg-deploy-service.yml
./scripts/wait_for_pod.bash
kubectl apply -f deployment/postgresql/pg-configmap.yml

# communicate
kubectl apply -f deployment/local/communicate/commu-deploy-service.yml

# usermgmt
kubectl apply -f deployment/local/usermgmt/usermgmt-deploy-service.yml

# authmgmt
kubectl apply -f deployment/local/authmgmt/authmgmt-deploy-service.yml

# booking
kubectl apply -f deployment/local/booking/booking-deploy-service.yml

# address
kubectl apply -f deployment/local/address/address-deploy-service.yml


# config
kubectl apply -f deployment/common/common-configmap.yml
kubectl apply -f deployment/config/firebase.yml
kubectl apply -f deployment/config/twilio.yml
kubectl apply -f deployment/local/ingress/default-ingress.yml

# migration
kubectl apply -f deployment/local/jobs/migration-db.yaml