import { Client } from "utils/axiosClient";

export const googleapisClient = new Client({ baseURL: "https://maps.googleapis.com/maps/api/"});

googleapisClient.setApiKey("key", process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "")