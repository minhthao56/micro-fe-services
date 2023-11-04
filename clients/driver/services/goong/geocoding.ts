import {goongClient} from "./client";


export const getAddressByLatLng= async (lat: number, long: number) => {
  const response = await goongClient.get<any>("Geocode", {
    params: {
        latlng: `${lat},${long}`,
    },
  });
  return response;
};