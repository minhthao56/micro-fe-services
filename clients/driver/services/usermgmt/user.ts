import { userClient } from "./client";
import {  WhoamiResp } from "schema/usermgmt/WhoamiResp"

export async function whoami(): Promise<WhoamiResp> {
  return await userClient.get<WhoamiResp>("/whoami");
}
