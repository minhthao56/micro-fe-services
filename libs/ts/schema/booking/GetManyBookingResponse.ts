export interface GetManyBookingResponse {
    booking: SchemaBooking[] | null;
    limit:   number;
    offset:  number;
    total:   number;
    [property: string]: any;
}

export interface SchemaBooking {
    booking_id?:  string;
    created_at?:  string;
    customer?:    SchemaCustomer;
    customer_id?: string;
    distance?:    number;
    driver?:      SchemaDriver;
    driver_id?:   string;
    end_lat?:     number;
    end_long?:    number;
    start_lat?:   number;
    start_long?:  number;
    status?:      string;
    [property: string]: any;
}

export interface SchemaCustomer {
    customer_id:  string;
    email?:       string;
    first_name:   string;
    last_name:    string;
    lat?:         number;
    long?:        number;
    phone_number: string;
    user_id:      string;
    [property: string]: any;
}

export interface SchemaDriver {
    current_lat?:    number;
    current_long?:   number;
    driver_id:       string;
    email?:          string;
    first_name:      string;
    last_name:       string;
    phone_number:    string;
    status:          string;
    user_id:         string;
    vehicle_name:    string;
    vehicle_type_id: string;
    [property: string]: any;
}
