export interface GetCustomersResponse {
    customers: SchemaCustomer[] | null;
    limit:     number;
    offset:    number;
    total:     number;
    [property: string]: any;
}

export interface SchemaCustomer {
    customer_id:  string;
    email?:       string;
    first_name:   string;
    last_name:    string;
    lat?:         string;
    long?:        string;
    phone_number: string;
    [property: string]: any;
}
