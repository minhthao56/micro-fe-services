
build-go:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/usermgmt ./services/usermgmt/

u:
	docker build -f deployment/usermgmt.Dockerfile -t taxi/usermgmt:1.0 .

build-rust:
	cd services/authmgmt/ && cargo build --release

run-rust:
	cd services/authmgmt/ && cargo run