export interface CreateBookingRequest {
    customerID: string;
    driverID:   string;
    endLat:     number;
    endLong:    number;
    startLat:   number;
    startLong:  number;
    status:     string;
    [property: string]: any;
}
