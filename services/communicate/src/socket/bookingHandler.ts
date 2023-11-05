import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { PoolClient } from "pg";
import { CreateBookingRequest } from "schema/booking/CreateBookingRequest";
import {
  NewBookingSocketRequest,
  CustomerSocket,
  BookingStatusSocketResponse,
} from "schema/socket/booking";
import { SocketEventBooking } from "schema/constants/event";
import { DecodedIdTokenCustom } from "../types/app";

export function registerBookingHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  db: PoolClient,
  decodedIdTokenCustom: DecodedIdTokenCustom
) {
  socket.on(
    SocketEventBooking.BOOKING_NEW,
    async (data: CreateBookingRequest) => {
      const { driverID } = data;
      const result = await db.query(
        `
    SELECT socket_id FROM driver AS d JOIN users AS u ON d.user_id = u.user_id
    WHERE d.driver_id = $1 AND u.socket_id IS NOT NULL AND d.status = 'ONLINE'`,
        [driverID]
      );

      if (result.rowCount === 0) {
        console.log("Cannot find driver");
        return;
      }

      const { socket_id } = result.rows[0];

      const customers = await db.query<CustomerSocket>(
        `
    SELECT c.customer_id, c.lat, c.long, u.email, u.first_name, u.last_name, u.phone_number, u.socket_id  
    FROM customer AS c JOIN users AS u ON c.user_id = u.user_id
    WHERE u.user_id = $1 AND user_group = $2 AND socket_id IS NOT NULL;
    `,
        [decodedIdTokenCustom.db_user_id, decodedIdTokenCustom.user_group]
      );

      if (customers.rowCount === 0) {
        console.log("Cannot find customer");
        return;
      }
      const customer = customers.rows[0];

      const req: NewBookingSocketRequest = {
        ...data,
        customer,
      };

      io.sockets
        .to(socket_id)
        .emit(SocketEventBooking.BOOKING_WAITING_DRIVER, req);
    }
  );

  socket.on(
    SocketEventBooking.BOOKING_STATUS,
    async (data: BookingStatusSocketResponse) => {
      const { customer, status } = data;
      io.sockets
        .to(customer.socket_id)
        .emit(SocketEventBooking.BOOKING_WAITING_CUSTOMER, { status });
    }
  );
}
