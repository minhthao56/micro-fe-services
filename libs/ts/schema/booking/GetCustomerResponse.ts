export interface GetCustomerResponse {
    customer: SchemaCustomer;
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
    [property: string]: any;
}
