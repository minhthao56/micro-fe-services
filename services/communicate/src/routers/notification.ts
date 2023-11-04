import express, { Router } from "express";
import type { PoolClient } from 'pg';
import type { Request } from "../types/app";

const router: Router = express.Router();
router.get("/", async (req: Request, res) => {
  const decodedToken = req.decodedIdToken;

  const db = req.app.get("db") as PoolClient

  const r = await db.query("SELECT * FROM users");

  res.json({
    "request_url": req.originalUrl,
    "db_result": r.rows,
    "decoded_token": decodedToken,
  });
});

export default router;