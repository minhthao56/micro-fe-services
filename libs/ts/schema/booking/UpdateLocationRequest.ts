export interface UpdateLocationRequest {
    current_lat:  number;
    current_long: number;
    driver_id:    string;
    [property: string]: any;
}
