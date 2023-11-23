import React, { useCallback } from "react";
import { Details, Region } from "react-native-maps";
import { XStack, Button, YStack, Text, Card, Spinner } from "tamagui";
import { MapPin } from "@tamagui/lucide-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { MapContainer } from "tamagui-shared-ui";

import { getAddressByLatLng } from "../../services/goong/geocoding";
import { updateCurrentLocation } from "../../services/booking/customer";

export default function CurrentPage() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject>();
  const [address, setAddress] = useState("");
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);

  const handleCurrentLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
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
    setCurrentLocation(location);
  }, []);

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  const onRegionChangeComplete = (region: Region, _: Details) => {
    setCurrentLocation({
      coords: {
        latitude: region.latitude,
        longitude: region.longitude,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
  };

  const handleConfirmDestination = async () => {
    setIsLoading(true);
    try {
      await updateCurrentLocation({
        lat: currentLocation?.coords.latitude || 0,
        long: currentLocation?.coords.longitude || 0,
      });
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  if (!currentLocation) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  const renderBottom = () => {
    return (
      <XStack position="absolute" bottom={0} left={0} right={0}>
        <YStack flex={1} p="$2">
          <Card
            flex={1}
            mb="$2"
            justifyContent="center"
            alignItems="center"
            py="$3"
            px="$4"
          >
            <XStack>
              <MapPin size="$1" />
              <Text ml="$2">{address}</Text>
            </XStack>
          </Card>
          <Button
            mb={insets.bottom + 6}
            onPress={handleConfirmDestination}
            disabled={isLoading}
            icon={ isLoading ? <Spinner size="small"/> : undefined}
          >
            Confirm Destination
          </Button>
        </YStack>
      </XStack>
    );
  };

  return (
    <MapContainer
      renderBottom={renderBottom}
      onRegionChangeComplete={onRegionChangeComplete}
      initialRegion={{
        latitude: currentLocation?.coords.latitude || 0,
        longitude: currentLocation?.coords.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* <Marker
        coordinate={{
          latitude: currentLocation?.coords.latitude || 0,
          longitude: currentLocation?.coords.longitude || 0,
        }}
      /> */}
    </MapContainer>
  );
}
