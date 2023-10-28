export interface CreateUserResponse {
    email:        string;
    first_name:   string;
    last_name:    string;
    phone_number: string;
    user_group:   string;
    user_id:      number;
    [property: string]: any;
}
