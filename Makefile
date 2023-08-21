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
	yarn && yarn workspace communicatemgmt build && cd services/communicatemgmt/ && cp -r dist ../../build/
	cp -r package.json build/
	cd build && yarn --production

docker-communicatemgmt:
	docker build -f deployment/communicatemgmt.Dockerfile -t taxi/communicatemgmt .
