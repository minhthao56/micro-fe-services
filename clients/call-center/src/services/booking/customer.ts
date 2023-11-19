import { GetCustomersRequest } from "schema/booking/GetCustomersRequest";
import { GetCustomersResponse } from "schema/booking/GetCustomersResponse";
import { GetNearbyDriversRequest } from "schema/booking/GetNearbyDriversRequest";
import { GetNearbyDriversResponse } from "schema/booking/GetNearbyDriversResponse";

import { bookingClient } from "./client";

export const getCustomers = async (params: GetCustomersRequest) => {
  return await bookingClient.get<GetCustomersResponse>("/customers", {
    params: params,
  });
};


export async function findNearByDriver(req: GetNearbyDriversRequest) {
  console.log("findNearByDriver", req);
  return await bookingClient.get<
    GetNearbyDriversResponse
  >("driver/nearby",{
    params:{
        lat: `${req.request_lat}`,
        long: `${req.request_long}`,
    },
  });
}
