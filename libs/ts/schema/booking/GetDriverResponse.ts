export interface GetDriverResponse {
    driver: SchemaDriver;
    [property: string]: any;
}

export interface SchemaDriver {
    created_at:      string;
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
