import { Client } from "utils/axiosClient";
import { authMobile } from "utils/firebase/mobile";

export const addressClient = new Client({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
    path: "address",
    authProvider: authMobile
  });
  