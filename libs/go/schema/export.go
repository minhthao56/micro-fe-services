package schema

func GetEntities() map[string]interface{} {
	return map[string]interface{}{
		"CreateFirebaseUserRequest":  CreateFirebaseUserRequest{},
		"CreateFirebaseUserResponse": CreateFirebaseUserResponse{},
		"CustomTokenRequest":         CustomTokenRequest{},
		"CustomTokenResponse":        CustomTokenResponse{},
		"SetLocationRequest":         SetLocationRequest{},
		"StatusResponse":             StatusResponse{},
	}
}
