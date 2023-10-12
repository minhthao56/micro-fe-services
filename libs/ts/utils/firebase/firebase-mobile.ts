import { initializeApp, getApps, getApp, FirebaseApp} from "firebase/app";

import {
  Auth,
  getAuth,
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./config";
let app: FirebaseApp;
let auth: Auth;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}
export { auth }