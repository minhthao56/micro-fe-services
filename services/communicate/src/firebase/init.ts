import * as admin from "firebase-admin";

const serviceAccount = require("/firebase/firebase-config.json");
export const firebaseApp =  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

