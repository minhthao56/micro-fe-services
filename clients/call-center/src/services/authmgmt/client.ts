import { Client } from "utils/axiosClient";
import { authWeb } from "utils/firebase/web";


export const authClient = new Client({
    baseURL: process.env.REACT_APP_BASE_URL || "",
    path: "authmgmt",
    authProvider: authWeb,
});
