package schema

type Driver struct {
	DriverID      string  `json:"driver_id" required:"true"`
	CurrentLong   float64 `json:"current_long"`
	CurrentLat    float64 `json:"current_lat"`
	FirstName     string  `json:"first_name" required:"true"`
	LastName      string  `json:"last_name" required:"true"`
	Email         string  `json:"email"`
	PhoneNumber   string  `json:"phone_number" required:"true"`
	VehicleName   string  `json:"vehicle_name" required:"true"`
	VehicleTypeID string  `json:"vehicle_type_id" required:"true"`
	Status        string  `json:"status" required:"true"`
}
type DriverWithDistance struct {
	DriverID      string  `json:"driver_id" required:"true"`
	CurrentLong   float64 `json:"current_long"`
	CurrentLat    float64 `json:"current_lat"`
	FirstName     string  `json:"first_name" required:"true"`
	LastName      string  `json:"last_name" required:"true"`
	Email         string  `json:"email"`
	PhoneNumber   string  `json:"phone_number" required:"true"`
	VehicleName   string  `json:"vehicle_name" required:"true"`
	VehicleTypeID string  `json:"vehicle_type_id" required:"true"`
	Status        string  `json:"status" required:"true"`
	Distance      float64 `json:"distance" required:"true"`
}

type GetDriversRequest struct {
	Search string `json:"search"`
	Limit  int    `json:"limit"`
	Offset int    `json:"offset"`
}
type GetDriversResponse struct {
	Drivers []Driver `json:"drivers"`
	Limit   int      `json:"limit" required:"true"`
	Offset  int      `json:"offset" required:"true"`
	Total   int      `json:"total" required:"true"`
}

type GetDriverRequest struct {
	DriverId string `json:"driver_id" required:"true"`
}

type GetDriverResponse struct {
	Driver Driver `json:"driver" required:"true"`
}

type GetNearbyDriversRequest struct {
	RequestLat  float64 `json:"request_lat" required:"true"`
	RequestLong float64 `json:"request_long" required:"true"`
}

type GetNearbyDriversResponse struct {
	Drivers []DriverWithDistance `json:"drivers" required:"true"`
}

type UpdateLocationRequest struct {
	DriverID    string  `json:"driver_id" required:"true"`
	CurrentLong float64 `json:"current_long" required:"true"`
	CurrentLat  float64 `json:"current_lat" required:"true"`
}

type UpdateStatusRequest struct {
	DriverID string `json:"driver_id" required:"true"`
	Status   string `json:"status" required:"true"`
}
