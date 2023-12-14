import "core-js/stable/atob";
import { authClient } from "./authmgmt/client";
import { userClient } from "./usermgmt/client";
import { bookingClient } from "./booking/client"
import { socketClient } from "./communicate/client"

export const setToken = (token: string) => {
  const list = [authClient, userClient, bookingClient];
  socketClient.setToken(token);
    list.forEach((client) => {
        client.setToken(token);
    });
};
