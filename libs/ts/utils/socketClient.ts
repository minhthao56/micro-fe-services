import { Socket, io } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

export class SocketClient {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(url: string, path: string) {
    this.socket = io(url, {
      path,
      autoConnect: false,
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  setToken(token: string) {
    this.socket.auth = { token };
  }

  getSocket() {
    return this.socket;
  }
}
