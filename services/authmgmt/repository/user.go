package repository

import (
	"context"
	"database/sql"
)

type UserRepository interface {
	GetUserByUID(ctx context.Context, uid string) (string, error)
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &UserRepositoryImpl{db: db}
}

func (u *UserRepositoryImpl) GetUserByUID(ctx context.Context, firebaseUID string) (string, error) {
	var userID string
	err := u.db.QueryRow("SELECT user_id FROM users WHERE firebase_uid = $1", firebaseUID).
		Scan(&userID)
	if err != nil {
		return "", err
	}
	return userID, nil
}

func (u *UserRepositoryImpl) GetByUIDWithUserGroup(ctx context.Context, firebaseUID string, userGroup string) (string, error) {
	var userID string
	err := u.db.QueryRow("SELECT user_id FROM users WHERE firebase_uid = $1 AND user_group = $2", firebaseUID, userGroup).
		Scan(&userID)
	if err != nil {
		return "", err
	}
	return userID, nil
}
