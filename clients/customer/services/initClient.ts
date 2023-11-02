import { authClient } from "./authmgmt/client";
import { userClient } from "./usermgmt/client";
import { bookingClient } from "./booking/client"

export const setToken = (token: string) => {
  const list = [authClient, userClient, bookingClient];
    list.forEach((client) => {
        client.setToken(token);
    });
};
