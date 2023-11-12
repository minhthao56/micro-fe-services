import express, { Express, Router } from "express";
import bodyParser from "body-parser";

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Database } from "database";
import morgan from "morgan";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


import notiRouter from "./routers/notification";
import phoneRouter from "./routers/phone";
import { firebaseApp } from "./firebase/init";
import { TwilioService } from "./twilio/init";
import { validateJWT, validateSocketJWT } from "./middleware/validate-jwt"
import { registerConnectionHandlers, registerDisconnectionHandlers } from "./socket/connectionHandler"
import { registerBookingHandlers } from "./socket/bookingHandler"

export async function startServer() {
  const app: Express = express();
  const port = 7070;

  try {
    const conn = await Database.getConnection();
    const firebaseAuth = firebaseApp.auth();
    const twilioService = new TwilioService();

    // Set app variables
    app.set("firebaseAuth", firebaseAuth);
    app.set("db", conn);
    app.set("twilioService", twilioService);

    // Middleware
    app.use(morgan("combined"));
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Routers
    const privateRouter = Router();
    privateRouter.use(validateJWT);
    app.use("/communicate/private", privateRouter);
    privateRouter.use("/notification", notiRouter);

    const publicRouter = Router();
    app.use("/communicate/public", publicRouter);
    publicRouter.use("/phone", phoneRouter);


   


    // Socket.io
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

      registerBookingHandlers(io, socket, conn, decodedIdToken);

    }

    io.on("connection", onConnection);


    // Start server
    httpServer.listen(port, () => {
      console.log(`server is listening on ${port}`);
    });

  } catch (e) {
    console.log("Error in start service", e);
  }
}
