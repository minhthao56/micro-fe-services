import { bookingClient } from "./client";
import { SetLocationRequest } from "schema/booking/SetLocationRequest";
import { UpdateVIPRequest } from "schema/booking/UpdateVIPRequest";
import { GetCustomerResponse } from "schema/booking/GetCustomerResponse";


export async function updateCurrentLocation(req: SetLocationRequest) {
    return await bookingClient.post<SetLocationRequest, any>("/customer/set-location", req);
}

export async function updateVIP (req: UpdateVIPRequest) {
    return await bookingClient.post<UpdateVIPRequest, any>("/customer/vip", req);
}

export async function getCurrentCustomer () {
    return await bookingClient.get<GetCustomerResponse>("/customer");
}
