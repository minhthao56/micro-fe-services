import { bookingClient } from "./client";
import type { CreateBookingRequest } from "schema/booking/CreateBookingRequest";
import type { CreateBookingResponse } from "schema/booking/CreateBookingResponse";
import type { UpdateBookingRequest } from "schema/booking/UpdateBookingRequest";
import type { GetManyBookingRequest } from "schema/booking/GetManyBookingRequest";
import type { GetManyBookingResponse } from "schema/booking/GetManyBookingResponse";
import type { BookingPerTwoHours } from "schema/booking/BookingPerTwoHours";



export async function createBooking (req: CreateBookingRequest) {
  return await bookingClient.post<CreateBookingRequest, CreateBookingResponse >("/create", req);
}

export async function updateBooking (req: UpdateBookingRequest) {
  return await bookingClient.post<UpdateBookingRequest, any >("/update", req);
}

export async function getManyBooking (req: GetManyBookingRequest) {
  return await bookingClient.get<GetManyBookingResponse >("/", {
    params: req
  });
}

export async function getStatistics () {
  return await bookingClient.get<BookingPerTwoHours >("/statistics");
}