import express, { Router } from "express";
import { createNotification, getNotifications, readNotification } from "../controllers/notification";

const router: Router = express.Router();
router.get("/", getNotifications);
router.post("/create",createNotification);
router.put("/read/:notification_id", readNotification);

export default router;