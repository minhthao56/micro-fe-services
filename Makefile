
up:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o ./build/usermgmt ./services/usermgmt/

u:
	docker build -f deployment/usermgmt.Dockerfile -t taxi/usermgmt:1.0 .