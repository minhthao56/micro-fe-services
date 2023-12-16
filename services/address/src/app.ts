import express, { Router } from 'express'
import { Database } from "database";
import morgan from 'morgan';
import bodyParser from 'body-parser';

import addressRouter from "./router/address";

const app = express()
const port = 5050

async function startServer() {
    try {
        const conn = await Database.getConnection();
        app.set("db", conn);

        app.use(morgan("combined"));
        app.use(express.json());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));


        const privateRouter = Router();
        app.use("/address", privateRouter);
        privateRouter.use("/", addressRouter);

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.log("Error in start service", error);
    }
}

export default startServer;


