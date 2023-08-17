#!/bin/bash
minikube start

minikube addons enable ingress

eval $(minikube -p minikube docker-env)

make build-communicatemgmt
make docker-communicatemgmt

make build-usermgmt
make docker-usermgmt

make build-authmgmt
make docker-authmgmt

make build-ordermgmt
make docker-ordermgmt

kubectl apply -f deployment/communicatemgmt/commu-deploy-service.yml

kubectl apply -f deployment/usermgmt/usermgmt-deploy-service.yml

kubectl apply -f deployment/authmgmt/authmgmt-deploy-service.yml

kubectl apply -f deployment/ordermgmt/ordermgmt-deploy-service.yml

kubectl apply -f deployment/ingress/default-ingress.yml



