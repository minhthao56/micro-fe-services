import express, { Router } from "express";
import { TwilioService } from "../twilio/init";
import { NotificationFactory } from "../utils/notification";


const router: Router = express.Router();

router.post("/send", async (req, res) => {
    const { phone_number, message } = req.body;

    const twilioService = req.app.get("twilioService") as TwilioService;

    try {
        // const msg = await twilioService.sendSMS(phone_number, message)
        const notificationFactory = NotificationFactory.createNotification("sms", twilioService);
        notificationFactory.setTo(phone_number);
        notificationFactory.setBody(message);
        await notificationFactory.send();
        res.status(200).json({
            message: "Successfully sent SMS",
            // data: msg.toJSON()
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error: JSON.stringify(error) })
    }

})

export default router;
