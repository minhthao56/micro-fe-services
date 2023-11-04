import { Client } from "utils/axiosClient";

export const googleapisClient = new Client({ baseURL: "https://maps.googleapis.com/maps/api/"});
googleapisClient.setApiKey("key", process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "")

export const placesClient = new Client({ baseURL: "https://places.googleapis.com/v1/"});
//https://places.googleapis.com/v1/places:searchText
placesClient.setHeader("X-Goog-Api-Key", process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "")
placesClient.setHeader("X-Goog-FieldMask", "places.displayName,places.formattedAddress,places.location.latitude,places.location.longitude")