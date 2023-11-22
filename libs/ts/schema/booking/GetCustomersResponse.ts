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
    lat?:         number;
    long?:        number;
    phone_number: string;
    user_id:      string;
    [property: string]: any;
}
