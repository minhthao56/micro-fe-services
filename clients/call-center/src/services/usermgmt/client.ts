import { Client } from "utils/axiosClient";
import { authWeb } from "utils/firebase/web";


export const userClient = new Client({
    baseURL: process.env.REACT_APP_BASE_URL || "",
    path: "usermgmt/private",
    authProvider: authWeb
});
