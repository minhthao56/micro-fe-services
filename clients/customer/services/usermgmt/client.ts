import { Client } from "utils/axiosClient";

export const userClientPrivate = new Client({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
  path: "usermgmt/private",
});

export const userClientPublic = new Client({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
  path: "usermgmt/public",
});

