import { userClient } from "./client";
import { CreateUserRequest } from "schema/usermgmt/CreateUserRequest";
import { CreateUserResponse } from "schema/usermgmt/CreateUserResponse";



export async function whoami(): Promise<any> {
  return await userClient.get<any>("/whoami");
}

export async function createUser(user: CreateUserRequest){
  const resp = await userClient.post<CreateUserRequest, CreateUserResponse>("/create", user);
  return resp.data;
}