package entity

type CreateFirebaseUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateFirebaseUserResponse struct {
	UID string `json:"uid"`
}
