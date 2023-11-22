export interface CustomTokenRequest {
    expo_push_token?: string;
    firebaseToken:    string;
    userGroup:        string;
    [property: string]: any;
}
