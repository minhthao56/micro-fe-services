export interface CustomTokenRequest {
    firebaseToken: string;
    uid:           string;
    userGroup:     string;
    [property: string]: any;
}
