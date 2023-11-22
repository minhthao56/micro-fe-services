package schema

type CreateFirebaseUserRequest struct {
	Email    string `json:"email" required:"true"`
	Password string `json:"password" required:"true"`
}

type CreateFirebaseUserResponse struct {
	UID   string `json:"uid" required:"true"`
	Email string `json:"email" required:"true"`
}

type CustomTokenRequest struct {
	ExpoPushToken string `json:"expo_push_token"`
	FirebaseToken string `json:"firebaseToken" required:"true"`
	UserGroup     string `json:"userGroup" required:"true"`
}

type CustomTokenResponse struct {
	CustomToken string `json:"customToken" required:"true"`
}
