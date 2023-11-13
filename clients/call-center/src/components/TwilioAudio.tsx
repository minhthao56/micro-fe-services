import React, { useEffect, useState } from "react";
import { getAudio } from "../services/twilio/audio";

export interface TwilioAudioProps {
  url: string;
}

export default function TwilioAudio({ url }: TwilioAudioProps) {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const audioData = await getAudio(url) as Blob;
          const blob = new Blob([audioData], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(blob);
          setSrc(audioUrl);
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    fetchAudio();
  }, [url]);

  return (
    <audio controls>
      {src && <source src={src} type="audio/mpeg" />}
    </audio>
  );
}
