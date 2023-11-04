import React from "react";
import { Marker } from "react-native-maps";
import { XStack, Button, YStack, Text, Card, Spinner } from "tamagui";
import { Power } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

import { getAddressByLatLng } from "../../services/goong/geocoding";
import { MapContainer } from "tamagui-shared-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabOneScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const stringLocation = await AsyncStorage.getItem("currentLocation");
      let location = JSON.parse(stringLocation || "{}");

      if (!stringLocation) {
        location = await Location.getCurrentPositionAsync({});
        await AsyncStorage.setItem("currentLocation", JSON.stringify(location));
      }

      const address = await getAddressByLatLng(
        location.coords.latitude,
        location.coords.longitude
      );
      setAddress(address.results?.[0]?.formatted_address);
      setLocation(location);
    })();
  }, []);

  if (!location) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  const renderBottom = () => {
    return (
      <XStack position="absolute" bottom={0} left={0} right={0} justifyContent="center">
          <Button mb="$2" icon={Power} size="$5">Turn On</Button>
      </XStack>
    );
  };

  return (
    <MapContainer
      renderBottom={renderBottom}
      initialRegion={{
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showBackButton={false}
      showFakePin={false}
    >
      <Marker
        coordinate={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
        }}
      />
    </MapContainer>
  );
}
