export interface GetCustomersRequest {
    limit:    number;
    offset:   number;
    options?: SchemaOptionsCustomers;
    search:   string;
    [property: string]: any;
}

export interface SchemaOptionsCustomers {
    is_vip?: boolean;
    [property: string]: any;
}
