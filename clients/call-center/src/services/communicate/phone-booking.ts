import { communicateClient } from "./client";
import { GetManyPhoneBookingRequest , GetManyPhoneBookingResponse } from "schema/communicate/phone-booking"


export const getPhoneBookingList = async (params: GetManyPhoneBookingRequest) => {
  return await communicateClient.get<GetManyPhoneBookingResponse>("/phone-booking", { params });
};
