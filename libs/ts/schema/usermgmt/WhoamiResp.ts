export interface WhoamiResp {
    results: UserEntity;
    status:  string;
    [property: string]: any;
}

export interface UserEntity {
    email:        string;
    firebase_uid: string;
    first_name:   string;
    last_name:    string;
    phone_number: string;
    user_group:   string;
    user_id:      number;
    [property: string]: any;
}
