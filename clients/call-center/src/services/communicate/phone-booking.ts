import { communicateClient } from "./client";
import { GetManyPhoneBookingRequest , GetManyPhoneBookingResponse } from "schema/communicate/phone-booking"


export const getPhoneBookingList = async (params: GetManyPhoneBookingRequest) => {
  return await communicateClient.get<GetManyPhoneBookingResponse>("/phone-booking", { params });
};


export const updatePhoneBookingStatus = async (call_sid: string, status: string) => {
  return await communicateClient.put<any, any>(`/phone-booking/status/${call_sid}`, { status });
}