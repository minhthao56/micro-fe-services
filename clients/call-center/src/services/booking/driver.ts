import { bookingClient } from "./client";
import { GetDriversRequest } from "schema/booking/GetDriversRequest";
import { GetDriversResponse } from "schema/booking/GetDriversResponse";

export const getDrivers = async (params: GetDriversRequest) => {
  return await bookingClient.get<GetDriversResponse>("/drivers", {
    params: params,
  });
};
