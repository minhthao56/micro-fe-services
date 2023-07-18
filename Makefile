
build-go:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/usermgmt ./services/usermgmt/

docker-go:
	docker build -f deployment/usermgmt.Dockerfile -t taxi/usermgmt:1.0 .

build-rust:
	cd services/authmgmt/ && cargo build --release

run-rust:
	cd services/authmgmt/ && cargo run

docker-rust:
	docker build -f deployment/authmgmt.Dockerfile -t taxi/authmgmt:1.0 .