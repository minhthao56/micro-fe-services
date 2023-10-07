package auth

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

type FirebaseManager interface {
	CreateUser(ctx context.Context, email string, password string) (*auth.UserRecord, error)
	GetUser(ctx context.Context, uid string) (*auth.UserRecord, error)
	UpdateUser(ctx context.Context, uid string, email string, password string) (*auth.UserRecord, error)
	CustomTokenWithClaims(ctx context.Context, uid string, userGroup string, user_id string) (string, error)
}

type FirebaseManagerImpl struct {
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

func NewFirebaseManager() (FirebaseManager, error) {
	app, err := NewAppFirebase()
	if err != nil {
		return nil, err
	}
	authClient, err := app.Auth(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error initializing auth client: %v", err)
	}

	if err != nil {
		return nil, err
	}
	return &FirebaseManagerImpl{client: authClient}, nil
}

func (u *FirebaseManagerImpl) CreateUser(ctx context.Context, email string, password string) (*auth.UserRecord, error) {
	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password)
	user, err := u.client.CreateUser(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("error creating user: %v", err)
	}
	return user, nil
}

func (u *FirebaseManagerImpl) GetUser(ctx context.Context, uid string) (*auth.UserRecord, error) {
	user, err := u.client.GetUser(ctx, uid)
	if err != nil {
		return nil, fmt.Errorf("error getting user: %v", err)
	}
	return user, nil
}

func (u *FirebaseManagerImpl) UpdateUser(ctx context.Context, uid string, email string, password string) (*auth.UserRecord, error) {
	params := (&auth.UserToUpdate{}).
		Email(email).
		Password(password)
	user, err := u.client.UpdateUser(ctx, uid, params)
	if err != nil {
		return nil, fmt.Errorf("error updating user: %v", err)
	}
	return user, nil
}

func (u *FirebaseManagerImpl) CustomTokenWithClaims(ctx context.Context, uid string, userGroup string, userID string) (string, error) {
	claims := map[string]interface{}{
		"user_group": userGroup,
		"user_id":    userID,
	}
	token, err := u.client.CustomTokenWithClaims(ctx, uid, claims)
	if err != nil {
		return "", fmt.Errorf("error creating custom token: %v", err)
	}
	return token, nil
}

func (f *FirebaseManagerImpl) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	token, err := f.client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, fmt.Errorf("error VerifyIDToken: %v", err)
	}
	return token, nil
}
