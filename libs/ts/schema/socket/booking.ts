import { Customer } from "../booking/Customer"
import { CreateBookingRequest } from "../booking/CreateBookingRequest"
import { BookingStatus } from "../constants/status"


export interface CustomerSocket extends Customer {
    socket_id: string
}

export interface BookingSocketRequest extends CreateBookingRequest {
  from_call_center: boolean
  distance: number
}

export interface NewBookingSocketRequest extends BookingSocketRequest {
  customer: CustomerSocket
  admin_socket_id?: string
}

export interface BookingStatusSocketResponse extends BookingSocketRequest {
  customer: CustomerSocket
  admin_socket_id?: string
  status: keyof typeof BookingStatus
}

export interface LocationDriverSocket {
  driver_id: string
  lat: number
  long: number,
  customer_socket_id: string
}