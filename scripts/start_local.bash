#!/bin/bash
minikube start

minikube addons enable ingress

eval $(minikube -p minikube docker-env)

make build-communicatemgmt

make docker-communicatemgmt

make build-usermgmt

make docker-usermgmt



kubectl apply -f deployment/communicatemgmt/commu-deploy-service.yml

kubectl apply -f deployment/usermgmt/usermgmt-deploy-service.yml

kubectl apply -f deployment/ingress/default-ingress.yml



