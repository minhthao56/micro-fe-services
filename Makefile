# usermgmt
build-usermgmt:
	cross build --target x86_64-unknown-linux-gnu --release --bin usermgmt

docker-usermgmt:
	docker build -f deployment/usermgmt.Dockerfile -t taxi/usermgmt .

# booking
build-booking:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/booking ./services/booking/


docker-booking:
	docker build -f deployment/booking.Dockerfile -t taxi/booking .

# authmgmt
build-authmgmt:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/authmgmt ./services/authmgmt/

docker-authmgmt:
	docker build -f deployment/authmgmt.Dockerfile -t taxi/authmgmt .

# communicate
build-communicate:
	yarn
	npx nx build communicate

docker-communicate:
	docker build -f deployment/communicate.Dockerfile -t taxi/communicate .

# migration db
build-migration:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/migration ./cmd/migration

docker-migration:
	docker build -f deployment/migration-db.Dockerfile -t taxi/migration-db .

# gen schema json
gen-schema:
	cargo run --bin schema
	go run cmd/gencode/main.go

gen-typescript:
	scripts/generate-typescript.bash

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
	