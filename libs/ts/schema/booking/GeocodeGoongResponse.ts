export interface GeocodeGoongResponse {
    results?: Result[] | null;
    status?:  string;
    [property: string]: any;
}

export interface Result {
    address?:            string;
    address_components?: AddressComponent[] | null;
    compound?:           Compound;
    formatted_address?:  string;
    geometry?:           Geometry;
    name?:               string;
    place_id?:           string;
    plus_code?:          PlusCode;
    reference?:          string;
    types?:              string[] | null;
    [property: string]: any;
}

export interface AddressComponent {
    long_name?:  string;
    short_name?: string;
    [property: string]: any;
}

export interface Compound {
    commune?:  string;
    district?: string;
    province?: string;
    [property: string]: any;
}

export interface Geometry {
    boundary?: any;
    location?: Location;
    [property: string]: any;
}

export interface Location {
    lat?: number;
    lng?: number;
    [property: string]: any;
}

export interface PlusCode {
    compound_code?: string;
    global_code?:   string;
    [property: string]: any;
}
