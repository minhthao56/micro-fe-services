import { bookingClient } from "./client";
import { GetVehicleTypesResponse } from "schema/booking/GetVehicleTypesResponse";

export const getVehicleTypes = async () => {
  return await bookingClient.get<GetVehicleTypesResponse>("/vehicle-types");
};
