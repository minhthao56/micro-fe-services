import { Client } from "utils/axiosClient";

export const authClient = new Client({ baseURL: process.env.REACT_APP_BASE_URL || "", path: "authmgmt"});
