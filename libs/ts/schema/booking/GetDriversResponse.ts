export interface GetDriversResponse {
    drivers?: SchemaDriver[] | null;
    limit:    number;
    offset:   number;
    total:    number;
    [property: string]: any;
}

export interface SchemaDriver {
    current_lat?:    string;
    current_long?:   string;
    driver_id:       string;
    email?:          string;
    first_name:      string;
    last_name:       string;
    phone_number:    string;
    status:          string;
    vehicle_name:    string;
    vehicle_type_id: string;
    [property: string]: any;
}
