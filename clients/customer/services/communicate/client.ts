import { SocketClient } from "utils/socketClient"

export const socketClient = new SocketClient( process.env.EXPO_PUBLIC_BASE_URL || "", "/communicate/socket.io");
export const socket = socketClient.getSocket();