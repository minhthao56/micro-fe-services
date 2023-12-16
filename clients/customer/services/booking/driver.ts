import { bookingClient } from "./client";
import { GetNearbyDriversRequest } from "schema/booking/GetNearbyDriversRequest";
import { GetNearbyDriversResponse } from "schema/booking/GetNearbyDriversResponse";

export async function findNearByDriver(req: GetNearbyDriversRequest) {
  return await bookingClient.get<
    GetNearbyDriversResponse
  >("driver/nearby",{
    params:{
        start_lat: `${req.start_lat}`,
        start_long: `${req.start_long}`,
        end_lat: `${req.end_lat}`,
        end_long: `${req.end_long}`,
    },
  });
}

