import { GetFrequentlyAddressResponse } from 'schema/booking/GetFrequentlyAddressResponse';
import { bookingClient } from "./client";

export async function getFrequentlyAddresses () {
  return await bookingClient.get<GetFrequentlyAddressResponse>("/frequently-addresses");
}