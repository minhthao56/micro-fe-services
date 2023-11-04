import { bookingClient } from "./client";
import type { CreateBookingRequest } from "schema/booking/CreateBookingRequest";

export async function createBooking (req: CreateBookingRequest) {
  return await bookingClient.post<any, CreateBookingRequest>("booking", req);
}