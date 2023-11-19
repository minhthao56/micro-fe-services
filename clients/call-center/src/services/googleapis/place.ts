import { placesClient } from "./client";

export const searchAddress = async (address: string) => {
    const response = await placesClient.post<any, any>("places:searchText",{textQuery: address});
    return response;
}