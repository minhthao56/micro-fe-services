import express, { Express } from "express";
import notiRouter from "./routers/notification";
import morgan from "morgan";
import { Database } from "database";

const app: Express = express();

try {
  Database.getConnection();
} catch (e) {
  console.log("error connecting to database", e);
}

app.use(morgan("dev"));
app.use("/communicatemgmt", notiRouter);

export default app;
