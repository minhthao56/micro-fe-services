export interface GetManyBookingRequest {
    limit:   number;
    offset:  number;
    search?: string;
    [property: string]: any;
}
