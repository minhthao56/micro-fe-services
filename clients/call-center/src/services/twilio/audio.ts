import { twilioClient } from "./client"


export const getAudio= async (url: string) => {
    return await twilioClient.get(url, {
        responseType: 'arraybuffer', // Ensure the response is treated as binary data
        headers: {
          'Content-Type': 'audio/mpeg', // Set the Content-Type header
          // Add other headers if needed
        },
    });
}