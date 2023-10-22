import { Client } from "utils/axiosClient";

export const authClient = new Client({ baseURL: "http://api.taxi.com/", path: "authmgmt"});
