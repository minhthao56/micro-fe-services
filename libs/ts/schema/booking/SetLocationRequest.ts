export interface SetLocationRequest {
    display_name?:      string;
    formatted_address?: string;
    lat:                number;
    long:               number;
    [property: string]: any;
}
