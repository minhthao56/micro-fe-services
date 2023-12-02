export interface GetCustomersRequest {
    limit:  number;
    offset: number;
    search: string;
    [property: string]: any;
}
