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

type Booking struct {
	BookingID  string   `json:"booking_id"`
	DriverID   string   `json:"driver_id"`
	CustomerID string   `json:"customer_id"`
	StartLong  float64  `json:"start_long"`
	StartLat   float64  `json:"start_lat"`
	EndLong    float64  `json:"end_long"`
	EndLat     float64  `json:"end_lat"`
	Status     string   `json:"status"`
	Customer   Customer `json:"customer"`
	Driver     Driver   `json:"driver"`
	CreatedAt  string   `json:"created_at"`
}

type GetManyBookingResponse struct {
	Booking []Booking `json:"booking" required:"true"`
	Limit   int       `json:"limit" required:"true"`
	Offset  int       `json:"offset" required:"true"`
	Total   int       `json:"total" required:"true"`
}
type GetManyBookingRequest struct {
	Limit  int    `json:"limit" required:"true"`
	Offset int    `json:"offset" required:"true"`
	Search string `json:"search"`
}

type CreateBookingResponse struct {
	BookingID string `json:"booking_id"`
}

type UpdateBookingRequest struct {
	BookingID string `json:"booking_id" required:"true"`
	Status    string `json:"status" required:"true"`
}
