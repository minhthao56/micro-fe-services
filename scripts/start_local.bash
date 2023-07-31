#!/bin/bash
minikube start

minikube addons enable ingress

eval $(minikube -p minikube docker-env)

# docker pull node:18-alpine

make build-communicatemgmt

make docker-communicatemgmt

kubectl apply -f deployment/communicatemgmt/commu-deploy-service.yml

kubectl apply -f deployment/default-ingress.yml



