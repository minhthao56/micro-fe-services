import express, { Express } from "express";

import { createServer } from "http";
import { Server } from "socket.io";
import { Database } from "database";
import morgan from "morgan";

import notiRouter from "./routers/notification";
import { firebaseApp } from "./firebase/init";
import { validateJWT, validateSocketJWT } from "./middleware/validate-jwt"

export async function startServer() {
  const app: Express = express();
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

    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      socket.on("message", (msg) => {
        console.log("message: " + msg);
        io.sockets.to(socket.id).emit("message", {
          message: msg,
          socketId: socket.id,
        });
      });
    });
  

    const port = 7070;

    httpServer.listen(port, () => {
      console.log(`server is listening on ${port}`);
    });
  } catch (e) {
    console.log("Error in start service", e);
  }
}
