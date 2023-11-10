import { bookingClient } from "./client";
import type { UpdateLocationRequest } from "schema/booking/UpdateLocationRequest";
import type { UpdateStatusRequest } from "schema/booking/UpdateStatusRequest";

export async function updateLocation (req: UpdateLocationRequest) {
  return await bookingClient.post<UpdateLocationRequest, any >("/driver/update-location", req);
}

export async function updateStatus (req: UpdateStatusRequest) {
  return await bookingClient.post<UpdateStatusRequest, any >("/driver/update-status", req);
}