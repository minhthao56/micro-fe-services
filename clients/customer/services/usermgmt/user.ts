import { userClientPrivate, userClientPublic } from "./client";
import { CreateUserRequest } from "schema/usermgmt/CreateUserRequest";
import { CreateUserResponse } from "schema/usermgmt/CreateUserResponse";

export async function whoami(): Promise<any> {
  return await userClientPrivate.get<any>("/whoami");
}


export async function signUp(user: CreateUserRequest) {
  const resp = await userClientPublic.post<CreateUserRequest, CreateUserResponse>("/sign-up-customer", user);
  return resp.data;
}
