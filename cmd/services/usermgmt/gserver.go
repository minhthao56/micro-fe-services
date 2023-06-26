package usermgmt

import (
	"flag"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pbu "github.com/minthao56/setup-microservices/pkg/proto/usermgmt/v1"
	service "github.com/minthao56/setup-microservices/services/usermgmt/core/service"
)

var (
	port = flag.Int("port", 9090, "The server port")
)

func setupGRPC(grpcSvc *grpc.Server) {
	pbu.RegisterUserServiceServer(grpcSvc, &service.UserService{})
}

func init() {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	setupGRPC(s)
	fmt.Println("Hello, usermgmt!")

	reflection.Register(s)

	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
