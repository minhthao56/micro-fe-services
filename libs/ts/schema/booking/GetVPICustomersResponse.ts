export interface GetVPICustomersResponse {
    customers: SchemaCustomer[] | null;
    [property: string]: any;
}

export interface SchemaCustomer {
    address?:     SchemaAddress;
    customer_id:  string;
    email?:       string;
    first_name:   string;
    is_vip?:      boolean;
    last_name:    string;
    lat?:         number;
    long?:        number;
    phone_number: string;
    user_id:      string;
    [property: string]: any;
}

export interface SchemaAddress {
    display_name?:      string;
    formatted_address?: string;
    lat?:               number;
    long?:              number;
    [property: string]: any;
}