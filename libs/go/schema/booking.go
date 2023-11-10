package schema

type CreateBookingRequest struct {
	DriverID   string  `json:"driver_id" required:"true"`
	CustomerID string  `json:"customer_id" required:"true"`
	StartLong  float64 `json:"start_long" required:"true"`
	StartLat   float64 `json:"start_lat" required:"true"`
	EndLong    float64 `json:"end_long" required:"true"`
	EndLat     float64 `json:"end_lat" required:"true"`
	Status     string  `json:"status" required:"true"`
}
type CreateBookingResponse struct {
	BookingID string `json:"booking_id"`
}

type UpdateBookingRequest struct {
	BookingID string `json:"booking_id" required:"true"`
	Status    string `json:"status" required:"true"`
}
