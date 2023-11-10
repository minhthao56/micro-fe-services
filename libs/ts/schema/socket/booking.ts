import { Customer } from "../booking/Customer"
import { CreateBookingRequest } from "../booking/CreateBookingRequest"
import { BookingStatus } from "../constants/status"


export interface CustomerSocket extends Customer {
    socket_id: string
}

export interface NewBookingSocketRequest extends CreateBookingRequest {
  customer: CustomerSocket
}

export interface BookingStatusSocketResponse extends CreateBookingRequest {
  customer: CustomerSocket
  status: keyof typeof BookingStatus
}

export interface LocationDriverSocket {
  driver_id: string
  lat: number
  long: number,
  customer_socket_id: string
}