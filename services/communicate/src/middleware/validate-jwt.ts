import { Socket } from "socket.io";
import { Response, NextFunction } from "express";
import { Auth } from "firebase-admin/auth";
import { Request, DecodedIdTokenCustom } from "../types/app";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ExtendedError } from "socket.io/dist/namespace";

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firebaseAuth = req.app.get("firebaseAuth") as Auth;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Don't have token",
    });
  }
  try {
    const decodedToken = (await firebaseAuth.verifyIdToken(
      token
    )) as DecodedIdTokenCustom;
    req.decodedIdToken = decodedToken;
  } catch (e) {
    return res.status(401).json({
      message: "Invalid token",
      error: e,
    });
  }
  next();
};

export async function validateSocketJWT(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void, firebaseAuth: Auth
) {
    const token = socket.handshake.auth.token;
    if (!token) {
        next(new Error("Don't have token"));
        return;
    }
    try {
       const decodedToken = await firebaseAuth.verifyIdToken(token) as DecodedIdTokenCustom;
       socket.data.decodedIdToken = decodedToken;

    } catch (e) {
        next(new Error("Invalid token"));
        return;
    }
    next();
}
