import express from "express";
import notiRouter from "./routers/notification";
import morgan from 'morgan';
const app = express();

app.use(morgan('dev'));
app.use('/communicatemgmt',notiRouter);


export default app;