import { Client } from "utils/axiosClient";

export const authClient = new Client({ baseURL: process.env.EXPO_PUBLIC_BASE_URL ||"", path: "authmgmt"});