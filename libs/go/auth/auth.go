package auth

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

type UserManager interface {
	CreateUser(email string, password string) (*auth.UserRecord, error)
	GetUser(uid string) (*auth.UserRecord, error)
	UpdateUser(uid string, email string, password string) (*auth.UserRecord, error)
}

type UserManagerImpl struct {
	client *auth.Client
}

func NewAppFirebase() (*firebase.App, error) {
	configPath := "/firebase/firebase-config.json"
	configData, err := os.ReadFile(configPath)

	opt := option.WithCredentialsJSON(configData)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return app, fmt.Errorf("error initializing app: %v", err)
	}
	return app, nil
}

func NewAuthApp() (*auth.Client, error) {
	app, err := NewAppFirebase()
	if err != nil {
		return nil, err
	}
	authClient, err := app.Auth(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error initializing auth client: %v", err)
	}
	return authClient, nil
}

func NewUserManager() (UserManager, error) {
	authClient, err := NewAuthApp()
	if err != nil {
		return nil, err
	}
	return &UserManagerImpl{client: authClient}, nil
}

func (u *UserManagerImpl) CreateUser(email string, password string) (*auth.UserRecord, error) {
	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password)
	user, err := u.client.CreateUser(context.Background(), params)
	if err != nil {
		return nil, fmt.Errorf("error creating user: %v", err)
	}
	return user, nil
}

func (u *UserManagerImpl) GetUser(uid string) (*auth.UserRecord, error) {
	user, err := u.client.GetUser(context.Background(), uid)
	if err != nil {
		return nil, fmt.Errorf("error getting user: %v", err)
	}
	return user, nil
}

func (u *UserManagerImpl) UpdateUser(uid string, email string, password string) (*auth.UserRecord, error) {
	params := (&auth.UserToUpdate{}).
		Email(email).
		Password(password)
	user, err := u.client.UpdateUser(context.Background(), uid, params)
	if err != nil {
		return nil, fmt.Errorf("error updating user: %v", err)
	}
	return user, nil
}
