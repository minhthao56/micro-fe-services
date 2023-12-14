import { Client } from "utils/axiosClient";
import { authMobile } from "utils/firebase/mobile";


export const userClientPrivate = new Client({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
  path: "usermgmt/private",
  authProvider: authMobile
});

export const userClientPublic = new Client({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
  path: "usermgmt/public",
});

