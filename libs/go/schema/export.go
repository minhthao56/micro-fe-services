package schema

func GetUserSchema() map[string]interface{} {
	return map[string]interface{}{
		"CreateFirebaseUserRequest":  CreateFirebaseUserRequest{},
		"CreateFirebaseUserResponse": CreateFirebaseUserResponse{},
		"CustomTokenRequest":         CustomTokenRequest{},
		"CustomTokenResponse":        CustomTokenResponse{},
	}
}

func GetBookingSchema() map[string]interface{} {
	return map[string]interface{}{
		"SetLocationRequest":           SetLocationRequest{},
		"StatusResponse":               StatusResponse{},
		"CreateBookingRequest":         CreateBookingRequest{},
		"Customer":                     Customer{},
		"GetCustomersResponse":         GetCustomersResponse{},
		"GetCustomersRequest":          GetCustomersRequest{},
		"GetCustomerResponse":          GetCustomerResponse{},
		"GetCustomerRequest":           GetCustomerRequest{},
		"GetDriversRequest":            GetDriversRequest{},
		"GetDriversResponse":           GetDriversResponse{},
		"GetDriverRequest":             GetDriverRequest{},
		"GetDriverResponse":            GetDriverResponse{},
		"Driver":                       Driver{},
		"GetVehicleTypesResponse":      GetVehicleTypesResponse{},
		"VehicleType":                  VehicleType{},
		"GetNearbyDriversRequest":      GetNearbyDriversRequest{},
		"GetNearbyDriversResponse":     GetNearbyDriversResponse{},
		"CreateBookingResponse":        CreateBookingResponse{},
		"UpdateBookingRequest":         UpdateBookingRequest{},
		"UpdateLocationRequest":        UpdateLocationRequest{},
		"UpdateStatusRequest":          UpdateStatusRequest{},
		"GetManyBookingRequest":        GetManyBookingRequest{},
		"GetManyBookingResponse":       GetManyBookingResponse{},
		"GetFrequentlyAddressResponse": GetFrequentlyAddressResponse{},
		"GetHistoryBookingResponse":    GetHistoryBookingResponse{},
		"GeocodeGoongResponse":         GeocodeGoongResponse{},
	}
}
