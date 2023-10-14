import { CustomTokenRequest } from "schema/authmgmt/CustomTokenRequest";
import { CustomTokenResponse } from "schema/authmgmt/CustomTokenResponse";
import {authClient} from "./client"


export async function createCustomToken(
  request: CustomTokenRequest
): Promise<CustomTokenResponse> {
  return await authClient.post<CustomTokenRequest, CustomTokenResponse>(
    "/create-custom-token",
    request
  );
}
