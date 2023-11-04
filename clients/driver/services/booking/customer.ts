import { bookingClient } from "./client";
import { GetNearbyDriversRequest } from "schema/booking/GetNearbyDriversRequest";
import { GetNearbyDriversResponse } from "schema/booking/GetNearbyDriversResponse";

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
