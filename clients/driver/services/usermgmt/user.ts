import { userClient } from "./client";

export async function whoami(): Promise<any> {
  return await userClient.get<any>("/whoami");
}
