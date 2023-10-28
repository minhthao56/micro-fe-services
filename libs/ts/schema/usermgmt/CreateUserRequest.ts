export interface CreateUserRequest {
    email:        string;
    first_name:   string;
    last_name:    string;
    password:     string;
    phone_number: string;
    user_group:   string;
    [property: string]: any;
}
