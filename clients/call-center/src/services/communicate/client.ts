import { SocketClient } from "utils/socketClient"
import { Client } from "utils/axiosClient";

export const socketClient = new SocketClient( process.env.REACT_APP_BASE_URL || "", "/communicate/socket.io");

export const communicateClient = new Client({
  baseURL: process.env.REACT_APP_BASE_URL || "",
  path: "communicate/private",
});
