import { bookingClient } from "./client";
import { GeneralNumberResponse } from "schema/booking/GeneralNumberResponse"

export async function getGeneralNumber() {
  return await bookingClient.get<GeneralNumberResponse>("/dashboard/general-number");
}