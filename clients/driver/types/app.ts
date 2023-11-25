import { BookingStatusSocketResponse } from "schema/socket/booking";

export interface BookingStatusSocketResponseWithBookingId
  extends BookingStatusSocketResponse {
  booking_id: string;
}