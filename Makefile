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
	scripts/build_nodejs.bash communicate

docker-communicate:
	docker build -f deployment/communicate.Dockerfile -t taxi/communicate .

# address
build-address:
	scripts/build_nodejs.bash address

docker-address:
	docker build -f deployment/address.Dockerfile -t taxi/address .

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

gen-rust:
	scripts/gen_rust.bash   

# Frontend
start-frontend:
	npx nx dev call-center

build-callcenter:
	npx nx build call-center

preview:
	npx nx preview call-center

docker-callcenter:
	docker build -f deployment/callcenter.Dockerfile -t taxi/callcenter .

# App
customer-start-ios:
	npx nx ios customer 

customer-start-android:
	npx nx android customer --verbose 

driver-start-ios:
	npx nx ios driver

driver-start-android:
	npx nx android driver
	