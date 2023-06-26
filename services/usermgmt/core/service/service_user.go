package service

import (
	"context"
	"fmt"

	pb "github.com/minthao56/setup-microservices/pkg/proto/usermgmt/v1"
)

type UserService struct {
	pb.UnimplementedUserServiceServer
}

func NewUserService() *UserService {
	return &UserService{}
}

func (s *UserService) AddUser(context.Context, *pb.UserAddRequest) (*pb.UserResponse, error) {
	fmt.Println("AddUser")
	return nil, nil
}

func (s *UserService) EditUser(context.Context, *pb.GetOneUserResquest) (*pb.UserResponse, error) {
	fmt.Println("EditUser")
	return nil, nil
}
