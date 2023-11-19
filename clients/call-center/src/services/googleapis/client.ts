import { Client } from "utils/axiosClient";

export const placesClient = new Client({ baseURL: "https://places.googleapis.com/v1/"});
//https://places.googleapis.com/v1/places:searchText
placesClient.setHeader("X-Goog-Api-Key", process.env.REACT_APP_PUBLIC_GOOGLE_API_KEY || "")
placesClient.setHeader("X-Goog-FieldMask", "places.displayName,places.formattedAddress,places.location.latitude,places.location.longitude")