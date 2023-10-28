package schema

type VehicleType struct {
	VehicleTypeID string `json:"vehicle_type_id" required:"true"`
	VehicleName   string `json:"vehicle_name" required:"true"`
}

type GetVehicleTypesResponse struct {
	VehicleTypes []VehicleType `json:"vehicle_types" required:"true"`
}
