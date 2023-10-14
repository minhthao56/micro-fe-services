import { authClient } from "./authmgmt/client";
import { userClient } from "./usermgmt/client";

export const setToken = (token: string) => {
  const list = [authClient, userClient];
    list.forEach((client) => {
        client.setToken(token);
    });
};
