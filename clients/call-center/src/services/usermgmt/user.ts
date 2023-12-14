import { userClient } from "./client";
import { CreateUserRequest } from "schema/usermgmt/CreateUserRequest";
import { CreateUserResponse } from "schema/usermgmt/CreateUserResponse";
import { WhoamiResp } from "schema/usermgmt/WhoamiResp"


export async function whoami(): Promise<WhoamiResp> {
  return await userClient.get<WhoamiResp>("/whoami");
}

export async function createUser(user: CreateUserRequest){
  const resp = await userClient.post<CreateUserRequest, CreateUserResponse>("/create", user);
  return resp.data;
}