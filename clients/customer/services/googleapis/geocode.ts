import {googleapisClient} from "./client";


export const getAddressByLatLng= async (lat: number, long: number) => {
  const response = await googleapisClient.get<any>("geocode/json", {
    params: {
        latlng: `${lat},${long}`,
    },
  });
  return response;
};

export const searchAddress = async (address: string) => {
    const response = await googleapisClient.get<any>("geocode/json", {
        params: {
            address,
        },
    });
    return response;
}