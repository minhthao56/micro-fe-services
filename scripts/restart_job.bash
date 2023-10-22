kubectl delete job migration-db
eval $(minikube -p minikube docker-env)
ID=$(docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep "taxi/migration-db latest" | awk '{print $1}')
echo $ID
docker rmi -f $ID

make build-migration
make docker-migration

kubectl apply -f deployment/local/jobs/migration-db.yaml