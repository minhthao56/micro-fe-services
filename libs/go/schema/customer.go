package schema

type Customer struct {
	CustomerId  string  `json:"customer_id" required:"true"`
	Long        float64 `json:"long"`
	Lat         float64 `json:"lat"`
	IsVIP       bool    `json:"is_vip"`
	FirstName   string  `json:"first_name" required:"true"`
	LastName    string  `json:"last_name" required:"true"`
	Email       string  `json:"email"`
	PhoneNumber string  `json:"phone_number" required:"true"`
	UserID      string  `json:"user_id" required:"true"`
	Address     Address `json:"address"`
}

type SetLocationRequest struct {
	Long             float64 `json:"long" required:"true"`
	Lat              float64 `json:"lat" required:"true"`
	FormattedAddress string  `json:"formatted_address"`
	DisplayName      string  `json:"display_name"`
}
type StatusResponse struct {
	Message string `json:"message" required:"true"`
	Status  int    `json:"status" required:"true"`
}

type GetCustomersResponse struct {
	Limit     int        `json:"limit" required:"true"`
	Offset    int        `json:"offset" required:"true"`
	Total     int        `json:"total" required:"true"`
	Customers []Customer `json:"customers" required:"true"`
}

type GetCustomersRequest struct {
	Limit  int    `json:"limit" required:"true"`
	Offset int    `json:"offset" required:"true"`
	Search string `json:"search" required:"true"`
}
type GetCustomerResponse struct {
	Customer Customer `json:"customer" required:"true"`
}

type GetCustomerRequest struct {
	CustomerId string `json:"customer_id" required:"true"`
}

type UpdateVIPRequest struct {
	IsVIP bool `json:"is_vip" required:"true"`
}

type GetVPICustomersResponse struct {
	Customers []Customer `json:"customers" required:"true"`
}
