import React, { useCallback } from "react";
import { Details, Region } from "react-native-maps";
import { XStack, Button, YStack, Text, Card, Spinner } from "tamagui";
import { MapPin } from "@tamagui/lucide-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { MapContainer , userInitialPosition} from "tamagui-shared-ui";
import { useToast } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";

import { SchemaAddress } from "schema/booking/GetFrequentlyAddressResponse";

import { getAddress } from "../../services/address/address";
import { updateCurrentLocation } from "../../services/booking/customer";

export default function CurrentPage() {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject>();
  
    const [address, setAddress] = useState<SchemaAddress>();

  const insets = useSafeAreaInsets();
  const toast = useToast();
  
  const { latitudeDelta, longitudeDelta } = userInitialPosition()

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

    const addr = await getAddress({
      lat: location.coords.latitude,
      long: location.coords.longitude,
    })
    
    setAddress({
      display_name: addr.display_name || "",
      formatted_address: addr.formatted_address || "",
      lat: location.coords.latitude,
      long: location.coords.longitude,
    });
    setCurrentLocation(location);
  }, []);

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  const onRegionChangeComplete = async (region: Region, _: Details) => {
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

    const addr = await getAddress({
      lat: region.latitude,
      long: region.longitude,
    });

    setAddress({
      display_name: addr.display_name || "",
      formatted_address: addr.formatted_address || "",
      lat: region.latitude,
      long: region.longitude,
    });
  };

  const handleConfirmDestination = async () => {
    setIsLoading(true);
    try {
      await updateCurrentLocation({
        lat: currentLocation?.coords.latitude || 0,
        long: currentLocation?.coords.longitude || 0,
        display_name: address?.display_name,
        formatted_address: address?.formatted_address,
      });
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(currentLocation)
      );
      toast.show("Your location has been updated!", { type: "success" });
    } catch (error: any) {
      console.log(error);
      toast.show(error.message, { type: "danger" });
    } finally {
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
              <Text ml="$2">{address?.formatted_address}</Text>
            </XStack>
          </Card>
          <Button
            mb={insets.bottom + 6}
            onPress={handleConfirmDestination}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : undefined}
          >
            Confirm Destination
          </Button>
        </YStack>
      </XStack>
    );
  };

  return (
    <>
      <StatusBar style="dark" />
      <MapContainer
        renderBottom={renderBottom}
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={{
          latitude: currentLocation?.coords.latitude || 0,
          longitude: currentLocation?.coords.longitude || 0,
          latitudeDelta,
          longitudeDelta,
        }}
      >
        {/* <Marker
        coordinate={{
          latitude: currentLocation?.coords.latitude || 0,
          longitude: currentLocation?.coords.longitude || 0,
        }}
      /> */}
      </MapContainer>
    </>
  );
}
