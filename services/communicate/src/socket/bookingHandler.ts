import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { PoolClient } from "pg";
import { CreateBookingRequest } from "schema/booking/CreateBookingRequest";
import {
  NewBookingSocketRequest,
  CustomerSocket,
  BookingStatusSocketResponse,
  LocationDriverSocket,
} from "schema/socket/booking";
import { DecodedIdTokenCustom } from "../types/app";

export function registerBookingHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  db: PoolClient,
  decodedIdTokenCustom: DecodedIdTokenCustom
) {
  socket.on("booking:new", async (data: CreateBookingRequest) => {
    const { driver_id } = data;
    console.log("booking:new", data);
    const result = await db.query(
      `
    SELECT socket_id FROM drivers AS d JOIN users AS u ON d.user_id = u.user_id
    WHERE d.driver_id = $1 AND u.socket_id IS NOT NULL AND d.status = 'ONLINE'`,
      [driver_id]
    );

    if (result.rowCount === 0) {
      console.log("Cannot find driver");
      return;
    }
    console.log({ result });

    const { socket_id } = result.rows[0];

    const customers = await db.query<CustomerSocket>(
      `
    SELECT c.customer_id, c.lat, c.long, u.email, u.first_name, u.last_name, u.phone_number, u.socket_id  
    FROM customers AS c JOIN users AS u ON c.user_id = u.user_id
    WHERE u.user_id = $1 AND user_group = $2 AND socket_id IS NOT NULL;
    `,
      [decodedIdTokenCustom.db_user_id, decodedIdTokenCustom.user_group]
    );

    if (customers.rowCount === 0) {
      console.log("Cannot find customer");
      return;
    }

    console.log({ customers });
    const customer = customers.rows[0];

    const req: NewBookingSocketRequest = {
      ...data,
      customer_id: data.customer_id,
      customer,
    };

    console.log({ req });

    io.sockets.to(socket_id).emit("booking:waiting:driver", req);
  });

  socket.on("booking:status", async (data: BookingStatusSocketResponse) => {
    const { customer } = data;
    io.sockets
      .to(customer.socket_id)
      .emit("booking:waiting:customer", data);
  });

  socket.on("booking:driver:location", async (data: LocationDriverSocket) => {
    if (data.client_socket_id) {
      io.sockets
        .to(data.client_socket_id)
        .emit("booking:driver:location", data);
    }
  });
}
