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

# gen schema json
gen-schema:
	cargo run --bin entity

connect-db:
	psql -h 127.0.0.1 -p 5432 -d taxi-db -U postgres

gen-sqlx:
	cargo sqlx prepare --workspace

# Frontend
start-frontend:
	npx nx dev call-center

build-frontend:
	npx nx build call-center

# App
customer-start-ios:
	npx nx ios customer 

customer-start-android:
	npx nx android customer --verbose 

driver-start-ios:
	npx nx ios driver

driver-start-android:
	npx nx android driver