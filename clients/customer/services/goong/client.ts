import { Client } from "utils/axiosClient";

export const goongClient = new Client({ baseURL: "https://rsapi.goong.io/"});
goongClient.setApiKey("api_key", process.env.EXPO_PUBLIC_GOONG_KEY || "")
