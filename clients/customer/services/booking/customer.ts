import { bookingClient } from "./client";
import { SetLocationRequest } from "schema/booking/SetLocationRequest";

export async function updateCurrentLocation(req: SetLocationRequest) {
    return await bookingClient.post<SetLocationRequest, any>("/customer/set-location", req);
}

