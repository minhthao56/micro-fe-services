import { Client } from "utils/axiosClient";

export const userClient = new Client({ baseURL: "http://api.taxi.com/", path: "usermgmt"});
