import "core-js/stable/atob";
import { authClient } from "./authmgmt/client";
import { userClientPrivate } from "./usermgmt/client";
import { bookingClient } from "./booking/client";
import { socketClient, clientCommunicatePrivate } from "./communicate/client";

export const setToken = (token: string) => {
  const list = [authClient, userClientPrivate, bookingClient, clientCommunicatePrivate];
  socketClient.setToken(token);
  list.forEach((client) => {
    client.setToken(token);
  });
};
