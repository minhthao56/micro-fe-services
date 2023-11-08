export interface CreateBookingRequest {
    customer_id: string;
    driver_id:   string;
    end_lat:     number;
    end_long:    number;
    start_lat:   number;
    start_long:  number;
    status:      string;
    [property: string]: any;
}
