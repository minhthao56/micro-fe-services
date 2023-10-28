export interface GetVehicleTypesResponse {
    vehicle_types: SchemaVehicleType[] | null;
    [property: string]: any;
}

export interface SchemaVehicleType {
    vehicle_name:    string;
    vehicle_type_id: string;
    [property: string]: any;
}
