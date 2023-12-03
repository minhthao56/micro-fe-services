import type { GetFrequentlyAddressResponse } from 'schema/booking/GetFrequentlyAddressResponse';
import type { GetFrequentlyAddressRequest } from 'schema/booking/GetFrequentlyAddressRequest';
import type { GetHistoryBookingResponse } from 'schema/booking/GetHistoryBookingResponse';
import type { GetHistoryBookingRequest } from 'schema/booking/GetHistoryBookingRequest';

import { bookingClient } from "./client";

export async function getFrequentlyAddresses (params: GetFrequentlyAddressRequest) {
  return await bookingClient.get<GetFrequentlyAddressResponse>("/frequently-addresses", {
    params,
  });
}

export async function getHistoryBooking (params: GetHistoryBookingRequest) {
  return await bookingClient.get<GetHistoryBookingResponse>("/history", {params});
}