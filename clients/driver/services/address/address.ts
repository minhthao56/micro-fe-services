import type { AddressRequest, ProxyAddressType } from "schema/address/addess"
import { addressClient } from "./client"


export const getAddress = async (req:AddressRequest) => {
    const res = await addressClient.get<ProxyAddressType>("/", { params: {...req} });
    return res;
}