import express, { Router } from "express";
import { getManyPhoneBooking, updateStatusPhoneBooking } from "../controllers/phone-booking";

const router: Router = express.Router();
router.get("/", getManyPhoneBooking);
router.put("/status/:call_sid", updateStatusPhoneBooking);


export default router;