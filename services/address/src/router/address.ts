import express, { Router } from "express";
import { getAddress } from "../controller/address";

const router: Router = express.Router();
router.get("/", getAddress)
export default router;