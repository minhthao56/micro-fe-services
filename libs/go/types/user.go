package types

type CreateFirebaseUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
