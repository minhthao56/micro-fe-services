# usermgmt
build-usermgmt:
	cargo build --release --bin usermgmt


docker-usermgmt:
	docker build -f deployment/usermgmt.Dockerfile -t taxi/usermgmt .

# ordermgmt
build-ordermgmt:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/ordermgmt ./services/ordermgmt/


docker-ordermgmt:
	docker build -f deployment/ordermgmt.Dockerfile -t taxi/ordermgmt .

# authmgmt
build-authmgmt:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/authmgmt ./services/authmgmt/

docker-authmgmt:
	docker build -f deployment/authmgmt.Dockerfile -t taxi/authmgmt .

# communicatemgmt
build-communicatemgmt:
	pnpm install
	npx nx build communicatemgmt

docker-communicatemgmt:
	docker build -f deployment/communicatemgmt.Dockerfile -t taxi/communicatemgmt .

# migration db
build-migration:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/migration ./cmd/migration

docker-migration:
	docker build -f deployment/migration-db.Dockerfile -t taxi/migration-db .