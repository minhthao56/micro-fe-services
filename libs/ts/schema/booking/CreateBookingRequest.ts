export interface CreateBookingRequest {
    customer_id:    string;
    distance:       number;
    driver_id:      string;
    end_address?:   SchemaAddress;
    end_lat:        number;
    end_long:       number;
    start_address?: SchemaAddress;
    start_lat:      number;
    start_long:     number;
    status:         string;
    [property: string]: any;
}

export interface SchemaAddress {
    display_name?:      string;
    formatted_address?: string;
    lat?:               number;
    long?:              number;
    [property: string]: any;
}
