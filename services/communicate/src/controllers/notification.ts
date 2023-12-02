
import { Response } from "express";
import type { Request } from "../types/app";
import type { PoolClient } from 'pg';
import type { NotificationsResponse } from "schema/communicate/notification";


export async function createNotification(req: Request, res: Response) {
    const decodedToken = req.decodedIdToken;
    const body = req.body;
    const db = req.app.get("db") as PoolClient

    try {
        await db.query(`INSERT INTO notifications (user_id, title, body, is_read) VALUES ($1, $2, $3, $4)`, [decodedToken?.db_user_id, body.title, body.body, false]);

    } catch (e) {
        console.error(e);
        res.status(500).json({
            "status": "error",
            "error": e,
        });
        return;

    }
    res.status(200).json({
        "status": "success",
    });
}

export async function readNotification(req: Request, res: Response) {
    const decodedToken = req.decodedIdToken;
    const notification_id = req.params?.notification_id;
    const db = req.app.get("db") as PoolClient
    try {
        await db.query(`UPDATE notifications SET is_read = true WHERE user_id = $1 AND notification_id = $2`, [decodedToken?.db_user_id, notification_id]);

    } catch (e) {
        console.error(e);
        res.status(500).json({
            "status": "error",
            "error": e,
        });
        return;

    }
    res.status(200).json({
        "status": "success",
    });
}


export async function getNotifications(req: Request, res: Response) {
    const decodedToken = req.decodedIdToken;

    const db = req.app.get("db") as PoolClient
    const limit = req.query?.limit;
    const offset = req.query?.offset;
    const status = req.query?.status;

    let condition = "";

    switch (status) {
        case "read":
            condition = "AND is_read = true";
            break;
        case "unread":
            condition = "AND is_read = false";
            break;
        default:
            condition = "";
            break;
    }

    const stmt = `
    SELECT * FROM notifications 
    WHERE user_id = $1 ${condition}
    LIMIT $2
    OFFSET $3
  `;
    try {
        const notifications = await db.query(stmt, [
            decodedToken?.db_user_id,
            limit,
            offset
        ]);
        const total = await db.query(`SELECT COUNT(*) FROM notifications WHERE user_id = $1 ${condition}`, [decodedToken?.db_user_id]);

        const response: NotificationsResponse = {
            notifications: notifications.rows,
            total: total.rows[0].count
        }
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            "status": "error",
            "error": e,
        });
        return;
    }
}