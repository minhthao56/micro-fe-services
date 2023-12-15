/* eslint-disable @typescript-eslint/no-explicit-any */
import { communicateClient } from "./client";
import { SendSMSRequest  } from "schema/communicate/sms"


export const sendSMS = async (req: SendSMSRequest) => {
  return await communicateClient.post<SendSMSRequest, any>("/sms/send",req);
};
