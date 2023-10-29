export interface Driver {
    current_lat?:    number;
    current_long?:   number;
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
