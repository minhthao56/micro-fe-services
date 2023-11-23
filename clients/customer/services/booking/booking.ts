import { GetFrequentlyAddressResponse } from 'schema/booking/GetFrequentlyAddressResponse';
import { GetHistoryBookingResponse } from 'schema/booking/GetHistoryBookingResponse';
import { bookingClient } from "./client";

export async function getFrequentlyAddresses () {
  return await bookingClient.get<GetFrequentlyAddressResponse>("/frequently-addresses");
}

export async function getHistoryBooking () {
  return await bookingClient.get<GetHistoryBookingResponse>("/history");
}