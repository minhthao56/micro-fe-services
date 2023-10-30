import { useLocalSearchParams } from "expo-router";
import { MapPin } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { XStack, Button, YStack, Text, Card, Spinner } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapViewDirections from "react-native-maps-directions";
import { getAddressByLatLng } from "../../services/googleapis/geocode";
import { ParamsAddress } from "../../types/app";
import MapContainer from "../../components/MapContainer";



export default function PickUp() {
  const { displayName, formattedAddress, lat, long } =
    useLocalSearchParams<ParamsAddress>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
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
          <Button mb={insets.bottom + 8}>Choose This Pick-Up</Button>
        </YStack>
      </XStack>
    );
  };

  return (
    <MapContainer
      renderBottom={renderBottom}
      // onRegionChangeComplete={onRegionChangeComplete}
      initialRegion={{
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
        }}
      />
      <Marker
        coordinate={{
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(long) || 0,
        }}
      />

    <MapViewDirections
        origin={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
        }}
        destination={{
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(long) || 0,
        }}
        apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY || ""}
        // directionsServiceBaseUrl="https://rsapi.goong.io/Direction"
        strokeWidth={5}
        strokeColor="#00b0ff"
      />

      
    </MapContainer>
  );
}
