package repository

import (
	"context"
	"database/sql"
)

type UserEntity struct {
	UserID     string
	DriverID   string
	CustomerID string
}

type UserRepository interface {
	GetByUIDWithUserGroup(ctx context.Context, firebaseUID string, userGroup string) (UserEntity, error)
	UpdateExpoPushToken(ctx context.Context, userID string, expoPushToken string) error
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &UserRepositoryImpl{db: db}
}

func (u *UserRepositoryImpl) GetByUIDWithUserGroup(ctx context.Context, firebaseUID string, userGroup string) (UserEntity, error) {

	var userEntity UserEntity = UserEntity{}

	var userID string
	err := u.db.QueryRow("SELECT user_id FROM users WHERE firebase_uid = $1 AND user_group = $2", firebaseUID, userGroup).
		Scan(&userID)
	if err != nil {
		return userEntity, err
	}

	userEntity.UserID = userID

	if userGroup == "DRIVER_GROUP" {
		var driverID string
		err := u.db.QueryRow("SELECT driver_id FROM drivers WHERE user_id = $1", userID).
			Scan(&driverID)
		if err != nil {
			return userEntity, err
		}
		userEntity.DriverID = driverID
	}
	if userGroup == "CUSTOMER_GROUP" {
		var customerID string
		err := u.db.QueryRow("SELECT customer_id FROM customers WHERE user_id = $1", userID).
			Scan(&customerID)
		if err != nil {
			return userEntity, err
		}
		userEntity.CustomerID = customerID
	}

	return userEntity, nil
}

func (u *UserRepositoryImpl) UpdateExpoPushToken(ctx context.Context, userID string, expoPushToken string) error {
	_, err := u.db.Exec("UPDATE users SET expo_push_token = $1 WHERE user_id = $2", expoPushToken, userID)
	if err != nil {
		return err
	}
	return nil
}
