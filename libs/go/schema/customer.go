package schema

type SetLocationRequest struct {
	Long float64 `json:"long" required:"true"`
	Lat  float64 `json:"lat" required:"true"`
}
type StatusResponse struct {
	Message string `json:"message" required:"true"`
	Status  int    `json:"status" required:"true"`
}
