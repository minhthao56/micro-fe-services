import {goongClient} from "./client";
import {GeocodeGoongResponse} from "schema/booking/GeocodeGoongResponse"


export const getAddressByLatLng= async (lat: number, long: number) => {
  const response = await goongClient.get<GeocodeGoongResponse>("Geocode", {
    params: {
        latlng: `${lat},${long}`,
    },
  });
  return response;
};