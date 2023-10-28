import {GetCustomersRequest} from "schema/booking/GetCustomersRequest"
import {bookingClient} from "./client"


export const getCustomers = async (params: GetCustomersRequest) => {
    return await bookingClient.get("/customers", {
        params: params
    });
}