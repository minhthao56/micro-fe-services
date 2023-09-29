package entity

func GetEntities() map[string]interface{} {
	return map[string]interface{}{
		"CreateFirebaseUserRequest":  CreateFirebaseUserRequest{},
		"CreateFirebaseUserResponse": CreateFirebaseUserResponse{},
	}
}
