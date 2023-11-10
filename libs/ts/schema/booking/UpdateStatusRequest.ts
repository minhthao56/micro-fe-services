export interface UpdateStatusRequest {
    driver_id: string;
    status:    string;
    [property: string]: any;
}
