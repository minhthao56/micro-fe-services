export interface UpdateBookingRequest {
    booking_id: string;
    status:     string;
    [property: string]: any;
}
