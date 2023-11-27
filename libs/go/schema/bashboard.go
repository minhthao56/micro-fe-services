package schema

type GeneralNumberResponse struct {
	TotalCustomer   int `json:"total_customer"`
	TotalBooking    int `json:"total_booking"`
	TotalDriver     int `json:"total_driver"`
	TotalPhone      int `json:"total_phone"`
	NewCustomer     int `json:"new_customer"`
	NewBooking      int `json:"new_booking"`
	NewDriver       int `json:"new_driver"`
	NewPhone        int `json:"new_phone"`
	MonthlyCustomer int `json:"monthly_customer"`
	MonthlyBooking  int `json:"monthly_booking"`
	MonthlyDriver   int `json:"monthly_driver"`
	MonthlyPhone    int `json:"monthly_phone"`
}
