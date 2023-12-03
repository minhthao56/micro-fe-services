export interface GetFrequentlyAddressResponse {
    addresses?: SchemaAddress[] | null;
    total:      number;
    [property: string]: any;
}

export interface SchemaAddress {
    display_name?:      string;
    formatted_address?: string;
    lat?:               number;
    long?:              number;
    [property: string]: any;
}
