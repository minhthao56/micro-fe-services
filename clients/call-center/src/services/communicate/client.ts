import { SocketClient } from "utils/socketClient"

export const socketClient = new SocketClient( process.env.REACT_APP_BASE_URL || "", "/communicate/socket.io");