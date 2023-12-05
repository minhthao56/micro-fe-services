import express, { Router } from "express";
import { twiml } from "twilio";
import type { PoolClient } from "pg";
import { Customer } from "schema/booking/Customer";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const router: Router = express.Router();

const BASE_PATH = "/communicate/public/phone";

router.post("/income", async (req, res) => {
    const twimlResponse = new twiml.VoiceResponse();
    const gather = twimlResponse.gather({
        input: ["dtmf"],
        numDigits: 1,
        action: BASE_PATH + "/starting-address",
        method: "POST",
        timeout: 3,
    });

    gather.say(
        "Welcome to the booking service of Taxi SM. Press 1 to start booking"
    );

    twimlResponse.redirect(BASE_PATH + "/income");

    res.type("text/xml");
    res.send(twimlResponse.toString());
});

router.post("/starting-address", async (req, res) => {
    const caller = req.body.Caller;
    const callSid = req.body.CallSid;
    const db = req.app.get("db") as PoolClient;
    const twimlResponse = new twiml.VoiceResponse();

    const customers = await db.query<Customer>(
        `
        SELECT c.customer_id, u.email, u.phone_number, u.last_name, u.first_name, u.last_name, c.lat, c.long
        FROM users AS u JOIN customers AS c ON u.user_id = c.user_id 
        WHERE u.phone_number = $1
        OR u.phone_number = '+84' || $2
        OR u.phone_number = '84' || $3;
        `,
        [caller, caller, caller]
    );
    

    if (customers.rowCount === 0) {
        // TODO: Handle create new customer
        console.log(`Need to create new customer`);
    }
    // Insert new phone booking record
    const resultInsert = await db.query(
        `
    INSERT INTO phone_booking (call_sid, customer_id, status) VALUES ($1, $2, 'PENDING')`,
        [callSid, customers.rows[0].customer_id]
    );

    if (resultInsert.rowCount === 0) {
        twimlResponse.say("Sorry, we cannot process your request");
        twimlResponse.hangup();
        res.type("text/xml");
        res.send(twimlResponse.toString());
        return;
    }

    twimlResponse.say("Please say your starting address after the beep");
    twimlResponse.record({
        action: BASE_PATH + "/ending-address",
        maxLength: 3,
        playBeep: true,
        method: "POST",
        timeout: 3,
        recordingStatusCallback: BASE_PATH + "/ending-address",
    });

   
    

    res.type("text/xml");
    res.send(twimlResponse.toString());
});

router.post("/ending-address", async (req, res) => {
    const startRecordingUrl = req.body.RecordingUrl;
    // Update start recording url to database
    const callSid = req.body.CallSid;
    const db = req.app.get("db") as PoolClient;

    const resultUpdate = await db.query(
        `UPDATE phone_booking SET start_recording_url = $1 WHERE call_sid = $2`,
        [startRecordingUrl, callSid]
    );
    if (resultUpdate.rowCount === 0) {
        const twimlResponse = new twiml.VoiceResponse();
        twimlResponse.say("Sorry, we cannot process your request start address. The operator will call you back");
        twimlResponse.hangup();
        res.type("text/xml");
        res.send(twimlResponse.toString());
        return;
    }

    const twimlResponse = new twiml.VoiceResponse();
    twimlResponse.say("Please say your ending address after the beep");
    twimlResponse.record({
        action: BASE_PATH + "/done",
        maxLength: 3,
        playBeep: true,
        method: "POST",
        timeout: 3,
    });

    res.type("text/xml");
    res.send(twimlResponse.toString());
});

router.post("/done", async (req, res) => {
    const endRecordingUrl = req.body.RecordingUrl;
    const twimlResponse = new twiml.VoiceResponse();

    const callSid = req.body.CallSid;
    const db = req.app.get("db") as PoolClient;
    const caller = req.body.Caller;

    const resultUpdate = await db.query(
        `UPDATE phone_booking SET end_recording_url = $1 WHERE call_sid = $2`,
        [endRecordingUrl, callSid]
    );

    if (resultUpdate.rowCount === 0) {
        twimlResponse.say("Sorry, we cannot process your request end address. The operator will call you back");
        twimlResponse.hangup();
        res.type("text/xml");
        res.send(twimlResponse.toString());
        return;
    }

    twimlResponse.say("Thank you for using Taxi SM");
    twimlResponse.say("The operator will call you back to confirm your booking");
    twimlResponse.hangup();

    const io = req.app.get("io") as  Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    const admins = await db.query<{ socket_id: string, user_id: string }>(`
    SELECT socket_id, user_id FROM users 
    WHERE user_group = 'ADMIN_GROUP' AND socket_id IS NOT NULL;
    `);

    if (admins.rowCount !== 0) {
        admins.rows.forEach((admin) => {
            io.to(admin.socket_id).emit("phone-booking:new", {caller, callSid});
        });
        const userIDs = admins.rows.map((admin) => admin.user_id);

        const template = []
        for (let i = 0; i < userIDs.length; i++) {
            template.push(`($${i + 1}, 'New Phone Booking!', 'You have new phone booking from ${caller}')`);
        }

        await db.query(`
        INSERT INTO notifications (user_id, title, body)
        VALUES ${template.join(",")};
        `, [...userIDs]
        );
    }

    res.type("text/xml");
    res.send(twimlResponse.toString());
});

export default router;
