import { GetCustomersRequest } from "schema/booking/GetCustomersRequest";
import { GetCustomersResponse } from "schema/booking/GetCustomersResponse";

import { bookingClient } from "./client";

export const getCustomers = async (params: GetCustomersRequest) => {
  return await bookingClient.get<GetCustomersResponse>("/customers", {
    params: params,
  });
};
