export interface Customer {
    customer_id:  string;
    email?:       string;
    first_name:   string;
    last_name:    string;
    lat?:         string;
    long?:        string;
    phone_number: string;
    [property: string]: any;
}
