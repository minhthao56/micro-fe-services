import type { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { PoolClient } from "pg";
import { DecodedIdTokenCustom } from "../types/app";

export async function registerConnectionHandlers(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  db: PoolClient,
  decodedIdTokenCustom: DecodedIdTokenCustom
) {
  const { db_user_id, user_group, uid } = decodedIdTokenCustom;
  const socketId = socket.id;

  const result = await db.query(
    `UPDATE users
        SET socket_id = $1
        WHERE user_id = $2 AND user_group = $3 AND firebase_uid = $4`,
    [socketId, db_user_id, user_group, uid]
  );

  if (result.rowCount === 0) {
    console.log("Cannot update socket_id");
    socket.disconnect();
  }
}

export async function registerDisconnectionHandlers(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    db: PoolClient,
    decodedIdTokenCustom: DecodedIdTokenCustom
) {
    socket.on("disconnect", async () => {
        const { db_user_id, user_group, uid } = decodedIdTokenCustom;
        const result = await db.query(
            `UPDATE users
            SET socket_id = NULL
            WHERE user_id = $1 AND user_group = $2 AND firebase_uid = $3`,
            [db_user_id, user_group, uid]
        );
    
        if (result.rowCount === 0) {
            console.log("Cannot update socket_id");
            socket.disconnect();
        }
    })
}
