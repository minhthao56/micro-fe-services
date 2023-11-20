import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { PoolClient } from "pg";
import {
  NewBookingSocketRequest,
  CustomerSocket,
  BookingStatusSocketResponse,
  LocationDriverSocket,
  BookingSocketRequest,
} from "schema/socket/booking";
import { DecodedIdTokenCustom } from "../types/app";

export function registerBookingHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  db: PoolClient,
  decodedIdTokenCustom: DecodedIdTokenCustom
) {
  socket.on("booking:new", async (data: BookingSocketRequest) => {
    const { driver_id } = data;
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

    const { socket_id } = result.rows[0];

    let cmt = `
    SELECT c.customer_id, c.lat, c.long, u.email, u.first_name, u.last_name, u.phone_number, u.socket_id  
    FROM customers AS c JOIN users AS u ON c.user_id = u.user_id
    WHERE c.customer_id = $1
    `

    if (decodedIdTokenCustom.user_group !== "ADMIN_GROUP") {
      cmt = cmt + "AND socket_id IS NOT NULL;";
    }

    const customers = await db.query<CustomerSocket>(cmt, [data.customer_id]);

    if (customers.rowCount === 0) {
      console.log("Cannot find customer");
      return;
    }

    const customer = customers.rows[0];

    let admin_socket_id = ""

    if (decodedIdTokenCustom.user_group === "ADMIN_GROUP") {

      const admins = await db.query<{ socket_id: string }>(`
      SELECT socket_id FROM users AS u
      WHERE u.user_id = $1 AND u.user_group = $2 AND u.socket_id IS NOT NULL`,
        [decodedIdTokenCustom.db_user_id, decodedIdTokenCustom.user_group]);

      if (admins.rowCount === 0) {
        console.log("Cannot find admin");
        return;
      }

      admin_socket_id = admins.rows[0].socket_id;

    }

    const req: NewBookingSocketRequest = {
      ...data,
      customer_id: data.customer_id,
      customer,
      admin_socket_id,
    };


    io.sockets.to(socket_id).emit("booking:waiting:driver", req);
  });

  socket.on("booking:status", (data: BookingStatusSocketResponse) => {
    const { customer, from_call_center } = data;

    console.log("booking:status", data);

    if (from_call_center && data.admin_socket_id) {
      io.sockets.to(data.admin_socket_id).emit("booking:waiting:admin", data);
      return;
    }
    io.sockets
      .to(customer.socket_id)
      .emit("booking:waiting:customer", data);
  });

  socket.on("booking:driver:location", (data: LocationDriverSocket) => {
    if (data.customer_socket_id) {
      io.sockets
        .to(data.customer_socket_id)
        .emit("booking:driver:location", data);
    }
  });
}
