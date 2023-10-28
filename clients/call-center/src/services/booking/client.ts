import { Client } from "utils/axiosClient";

export const bookingClient = new Client({
  baseURL: process.env.REACT_APP_BASE_URL || "",
  path: "booking",
});
