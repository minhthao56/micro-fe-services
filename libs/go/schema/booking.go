package schema

type CreateBookingRequest struct {
	DriverID     string  `json:"driver_id" required:"true"`
	CustomerID   string  `json:"customer_id" required:"true"`
	StartLong    float64 `json:"start_long" required:"true"`
	StartLat     float64 `json:"start_lat" required:"true"`
	EndLong      float64 `json:"end_long" required:"true"`
	EndLat       float64 `json:"end_lat" required:"true"`
	Status       string  `json:"status" required:"true"`
	Distance     float64 `json:"distance" required:"true"`
	StartAddress Address `json:"start_address"`
	EndAddress   Address `json:"end_address"`
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
	Distance   float64  `json:"distance"`
}

type Address struct {
	Lat              float64 `json:"lat"`
	Long             float64 `json:"long"`
	FormattedAddress string  `json:"formatted_address"`
	DisplayName      string  `json:"display_name"`
}

type BookingWithAddress struct {
	Booking
	StartAddress Address `json:"start_address"`
	EndAddress   Address `json:"end_address"`
}

type BookingPerTwoHours struct {
	Results map[int]int `json:"results"`
}

type GetFrequentlyAddressResponse struct {
	Addresses []Address `json:"addresses"`
}

type GetManyBookingResponse struct {
	Booking []Booking `json:"booking" required:"true"`
	Limit   int       `json:"limit" required:"true"`
	Offset  int       `json:"offset" required:"true"`
	Total   int       `json:"total" required:"true"`
}

type GetHistoryBookingResponse struct {
	BookingWithAddress []BookingWithAddress `json:"booking" required:"true"`
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

type GeocodeGoongResponse struct {
	Results []struct {
		AddressComponents []struct {
			LongName  string `json:"long_name"`
			ShortName string `json:"short_name"`
		} `json:"address_components"`
		FormattedAddress string `json:"formatted_address"`
		Geometry         struct {
			Location struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"location"`
			Boundary any `json:"boundary"`
		} `json:"geometry"`
		PlaceID   string `json:"place_id"`
		Reference string `json:"reference"`
		PlusCode  struct {
			CompoundCode string `json:"compound_code"`
			GlobalCode   string `json:"global_code"`
		} `json:"plus_code"`
		Compound struct {
			District string `json:"district"`
			Commune  string `json:"commune"`
			Province string `json:"province"`
		} `json:"compound"`
		Types   []string `json:"types"`
		Name    string   `json:"name"`
		Address string   `json:"address"`
	} `json:"results"`
	Status string `json:"status"`
}
