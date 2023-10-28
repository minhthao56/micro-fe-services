import { Client } from "utils/axiosClient";

export const userClient = new Client({ baseURL: process.env.REACT_APP_BASE_URL ||"", path: "usermgmt"});
