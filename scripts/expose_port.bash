#!/bin/bash
port=$(sudo lsof -i -P -n | grep 5432 | awk '{print $2}')
sudo kill -9 $port
kubectl port-forward deployment/postgresql 5432:5432

#  psql -h 127.0.0.1 -p 5432 -d taxi-db -U postgres
# migrate -source file://migrations -database postgres://localhost:5432/taxi-db up 2


# helm install ingress-nginx ingress-nginx/ingress-nginx \
#   --set controller.service.type=LoadBalancer \
#   --set controller.service.externalTrafficPolicy=Cluster \
#   --set-string controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-disable-lets-encrypt-dns-records"="false" \
#   --set-string controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-size-unit"="1"

#   helm upgrade -i nginx-ingress ingress-nginx/ingress-nginx \
#     --set controller.publishService.enabled=true \
#     --set controller.service.externalTrafficPolicy=Cluster