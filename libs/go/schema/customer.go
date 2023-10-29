package schema

type Customer struct {
	CustomerId  string  `json:"customer_id" required:"true"`
	Long        float64 `json:"long"`
	Lat         float64 `json:"lat"`
	FirstName   string  `json:"first_name" required:"true"`
	LastName    string  `json:"last_name" required:"true"`
	Email       string  `json:"email"`
	PhoneNumber string  `json:"phone_number" required:"true"`
}

type SetLocationRequest struct {
	Long string `json:"long" required:"true"`
	Lat  string `json:"lat" required:"true"`
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
