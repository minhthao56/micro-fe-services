import express, { Router } from "express";
import type { PoolClient } from 'pg';
import type { PhoneBooking } from "schema/communicate/phone-booking";
import type { Request } from "../types/app";

const router: Router = express.Router();
router.get("/", async (req: Request, res) => {
    const queries = req.query
    const page = Number(queries.page) || 1;
    const limit = Number(queries.limit) || 10;
    const search = queries.search || ""

    const db = req.app.get("db") as PoolClient

    const phoneBooking = await db.query<PhoneBooking>(`
    SELECT pb.phone_booking_id, pb.start_recording_url, pb.end_recording_url, pb.call_sid, pb.status, pb.customer_id, u.last_name, u.first_name, u.phone_number, pb.created_at
    FROM phone_booking AS pb
    JOIN customers AS c ON pb.customer_id = c.customer_id
    JOIN users AS u ON c.user_id = u.user_id
    WHERE u.last_name LIKE $1 OR u.first_name LIKE $1
    LIMIT $2 OFFSET $3
  `, [`%${search}%`, limit, (page - 1) * limit])

    if (phoneBooking.rowCount === 0) {
        return res.json({
            phone_booking: [],
            total: 0
        });
    }

    const total = await db.query<{ count: number }>(`
    SELECT COUNT(*) FROM phone_booking AS pb
    JOIN customers AS c ON pb.customer_id = c.customer_id
    JOIN users AS u ON c.user_id = u.user_id
    WHERE u.last_name LIKE $1 OR u.first_name LIKE $1
    `, [`%${search}%`])


    if (total.rowCount === 0) {
        return res.json({
            phone_booking: [],
            total: 0
        });
    }

    res.json({
        phone_booking: phoneBooking.rows,
        total: total.rows[0].count
    });

});


router.put("/status/:call_sid", async (req: Request, res) => {
    const { call_sid } = req.params;
    const { status } = req.body;

    const db = req.app.get("db") as PoolClient

    const phoneBooking = await db.query<PhoneBooking>(`
    UPDATE phone_booking
    SET status = $1
    WHERE call_sid = $2
  `, [status, call_sid])

    if (phoneBooking.rowCount === 0) {
        return res.status(404).json({
            message: "phone booking not found"
        });
    }

    res.status(200).json({
        message: "success"
    });
});


export default router;