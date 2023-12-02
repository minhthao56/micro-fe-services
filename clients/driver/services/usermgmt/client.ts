import { Client } from "utils/axiosClient";

export const userClient = new Client({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
  path: "usermgmt/private",
});
