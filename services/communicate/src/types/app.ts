import { Request as ExpressRequest } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";


export interface DecodedIdTokenCustom extends DecodedIdToken {
  user_group: string;
  db_user_id: string;
}
export interface Request extends ExpressRequest {
  decodedIdToken?: DecodedIdTokenCustom;
}