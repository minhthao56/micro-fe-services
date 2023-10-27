package schema

type CreateBookingRequest struct {
	DriverID   string  `json:"driverID" required:"true"`
	CustomerID string  `json:"customerID" required:"true"`
	StartLong  float64 `json:"startLong" required:"true"`
	StartLat   float64 `json:"startLat" required:"true"`
	EndLong    float64 `json:"endLong" required:"true"`
	EndLat     float64 `json:"endLat" required:"true"`
	Status     string  `json:"status" required:"true"`
}
