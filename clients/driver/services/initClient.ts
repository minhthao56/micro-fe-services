import "core-js/stable/atob";
import { authClient } from "./authmgmt/client";
import { userClient } from "./usermgmt/client";
import { bookingClient } from "./booking/client"
import { socketClient } from "./communicate/client"
import { addressClient } from "./address/client"

export const setToken = (token: string) => {
  const list = [authClient, userClient, bookingClient, addressClient];
  socketClient.setToken(token);
    list.forEach((client) => {
        client.setToken(token);
    });
};
