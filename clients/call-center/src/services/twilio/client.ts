import { Client } from "utils/axiosClient";

export const twilioClient = new Client();
twilioClient.setBasicAuth(process.env.REACT_APP_TWILIO_ACCOUNT_SID || "", process.env.REACT_APP_TWILIO_AUTH_TOKEN || "");