export interface Customer {
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
