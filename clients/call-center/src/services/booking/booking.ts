import { bookingClient } from "./client";
import type { CreateBookingRequest } from "schema/booking/CreateBookingRequest";
import type { CreateBookingResponse } from "schema/booking/CreateBookingResponse";
import type { UpdateBookingRequest } from "schema/booking/UpdateBookingRequest";

export async function createBooking (req: CreateBookingRequest) {
  return await bookingClient.post<CreateBookingRequest, CreateBookingResponse >("/create", req);
}

export async function updateBooking (req: UpdateBookingRequest) {
  return await bookingClient.post<UpdateBookingRequest, any >("/update", req);
}