import { bookingClient } from "./booking/client";
import { authClient } from "./authmgmt/client";
import { userClient } from "./usermgmt/client";
import { communicateClient, socketClient } from "./communicate/client";

export const setToken = (token: string) => {
  const list = [authClient, userClient, bookingClient, communicateClient];
  socketClient.setToken(token);
  list.forEach((client) => {
    client.setToken(token);
  });
};
