import { Client } from "utils/axiosClient";
import { SocketClient } from "utils/socketClient"
import { authMobile } from "utils/firebase/mobile";


export const socketClient = new SocketClient( process.env.EXPO_PUBLIC_BASE_URL || "", "/communicate/socket.io");
export const socket = socketClient.getSocket();

export const clientCommunicatePrivate  = new Client({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL || "",
    path: "communicate/private",
    authProvider: authMobile,
})