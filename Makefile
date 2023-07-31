
build-usermgmt:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/usermgmt ./services/usermgmt/


docker-usermgmt:
	docker build -f deployment/usermgmt.Dockerfile -t taxi/usermgmt .


build-rust:
	cd services/authmgmt/ && cargo build --release && cp -r target ../../build/


run-rust:
	cd services/authmgmt/ && cargo run


docker-rust:
	docker build -f deployment/authmgmt.Dockerfile -t taxi/authmgmt .


build-communicatemgmt:
	cd services/communicatemgmt/ && npm run build && cp -r dist ../../build/
	cp -r services/communicatemgmt/package.json build/
	cd build && npm install --omit=dev

docker-communicatemgmt:
	docker build -f deployment/communicatemgmt.Dockerfile -t taxi/communicatemgmt .