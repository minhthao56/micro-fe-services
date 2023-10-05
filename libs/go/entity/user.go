package entity

type CreateFirebaseUserRequest struct {
	Email    string `json:"email" required:"true"`
	Password string `json:"password" required:"true"`
}

type CreateFirebaseUserResponse struct {
	UID   string `json:"uid" required:"true"`
	Email string `json:"email" required:"true"`
}
