import { Client } from "utils/axiosClient";

export const bookingClient = new Client({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
  path: "booking",
});
