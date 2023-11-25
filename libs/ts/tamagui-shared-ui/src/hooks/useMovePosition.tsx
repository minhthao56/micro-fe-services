import { useRef } from "react";
import MapView, { LatLng } from "react-native-maps";

export type FitToCoordinatesProps = {
  origin: LatLng;
  destination: LatLng;
};

const edgePaddingValue = 50;
export function useMovePosition() {
  const mapRef = useRef<MapView>(null);

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };
  const fitToCoordinates = async ({
    origin,
    destination,
  }: FitToCoordinatesProps) => {
    mapRef.current?.fitToCoordinates([origin, destination], {
      edgePadding: {
        top: edgePaddingValue,
        right: edgePaddingValue,
        bottom: edgePaddingValue,
        left: edgePaddingValue,
      },
      animated: true,
    });
  };
  return {
    moveTo,
    mapRef,
    fitToCoordinates,
  };
}
