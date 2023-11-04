import { bookingClient } from "./client";

import { GetVehicleTypesResponse } from "schema/booking/GetVehicleTypesResponse";


export async function getVehicleTypes() {
    return await bookingClient.get<GetVehicleTypesResponse>("vehicle-types");
}