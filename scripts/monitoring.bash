#!/bin/bash

set -e

kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml --force-conflicts=true --server-side=true

kubectl apply -f deployment/prometheus/prometheus_rbac.yam

kubectl apply -f deployment/prometheus/prometheus_instance.yaml

kubectl create deployment grafana --image=docker.io/grafana/grafana:latest 

kubectl apply -f deployment/prometheus/expose_prometheus.yaml