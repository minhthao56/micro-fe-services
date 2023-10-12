import { auth } from "./firebase-web";
import { AuthWithFirebase } from "./provider";

export const authWeb = new AuthWithFirebase(auth);
