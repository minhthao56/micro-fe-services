import goongClient from "@goongmaps/goong-sdk";
import geocoding from "@goongmaps/goong-sdk/services/geocoding";

const baseClient = goongClient({ accessToken: process.env.GOONG_TOKEN });

export const geocodingService = geocoding(baseClient);