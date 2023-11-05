import express, { Express } from "express";

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Database } from "database";
import morgan from "morgan";

import notiRouter from "./routers/notification";
import { firebaseApp } from "./firebase/init";
import { validateJWT, validateSocketJWT } from "./middleware/validate-jwt"
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { registerConnectionHandlers, registerDisconnectionHandlers } from "./socket/connectionHandler"

export async function startServer() {
  const app: Express = express();
  const port = 7070;

  try {
    const conn = await Database.getConnection();
    const firebaseAuth = firebaseApp.auth();

    app.set("firebaseAuth", firebaseAuth);
    app.set("db", conn);
    app.use(validateJWT)
    app.use(morgan("dev"));
    app.use("/communicate", notiRouter);

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      path: "/communicate/socket.io",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.use((socket, next) => {
      validateSocketJWT(socket, next, firebaseAuth)
    });


    function onConnection(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
      const { decodedIdToken } = socket.data;

      registerConnectionHandlers(socket, conn, decodedIdToken);
      
      registerDisconnectionHandlers(socket, conn, decodedIdToken);

    }

    io.on("connection", onConnection);
  


    httpServer.listen(port, () => {
      console.log(`server is listening on ${port}`);
    });

  } catch (e) {
    console.log("Error in start service", e);
  }
}
