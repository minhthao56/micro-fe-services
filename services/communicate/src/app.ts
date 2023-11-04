import express, { Express } from "express";

import { createServer } from "http";
import { Server } from "socket.io";


import notiRouter from "./routers/notification";
import morgan from "morgan";
import { Database } from "database";


const app: Express = express()


try {
  Database.getConnection();
} catch (e) {
  console.log("error connecting to database", e);
}

app.use(morgan("dev"));
app.use("/communicate", notiRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, { });

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg);
  });
});

export default httpServer;
