import { useLocalSearchParams } from "expo-router";
import { MapPin, Car, X } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { XStack, Button, YStack, Text, Card, Spinner } from "tamagui";
import { Sheet } from "@tamagui/sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Details, Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapViewDirections from "react-native-maps-directions";

import { getAddressByLatLng } from "../../services/goong/geocoding";
import { ParamsAddress } from "../../types/app";
import MapContainer from "../../components/MapContainer";
import { findNearByDriver } from "../../services/booking/customer";
import { getVehicleTypes } from "../../services/booking/vehicle-type"
import { SchemaVehicleType } from "schema/booking/GetVehicleTypesResponse"

export default function PickUp() {
  const { displayName, formattedAddress, lat, long } =
    useLocalSearchParams<ParamsAddress>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState("");
  const [origin, setOrigin] = useState<Location.LocationObject>();
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [vehicles, setVehicles] = useState <SchemaVehicleType[]>([]);

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

      const vehicleTypes = await getVehicleTypes();
      setVehicles(vehicleTypes.vehicle_types || []);
    })();
  }, []);

  const handlePickUp = async () => {
    try {
      setOrigin(location);
      setOpen(true);
      // const driver = await findNearByDriver({
      //   request_lat: parseFloat(lat) || 0,
      //   request_long: parseFloat(long) || 0,
      // });

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const onRegionChangeComplete = async (region: Region, details: Details)=>{
    setLocation({
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
    })

    const address = await getAddressByLatLng(
      region.latitude,
      region.longitude,
    );
    setAddress(address.results?.[0]?.formatted_address);
  }

  const handleChooseVehicle = () => {}

  const handleBooking = () => {}

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
          <Button mb={insets.bottom + 8} onPress={handlePickUp}>
            Choose This Pick-Up
          </Button>
        </YStack>
      </XStack>
    );
  };

  return (
    <>
      <MapContainer
        renderBottom={renderBottom}
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude:  location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          }}
        />
        <Marker
          coordinate={{
            latitude: parseFloat(lat) || 0,
            longitude: parseFloat(long) || 0,
          }}
        />

        {origin ? (
          <MapViewDirections
            origin={{
              latitude: origin?.coords.latitude || 0,
              longitude: origin?.coords.longitude || 0,
            }}
            destination={{
              latitude: parseFloat(lat) || 0,
              longitude: parseFloat(long) || 0,
            }}
            apikey={process.env.EXPO_PUBLIC_GOONG_KEY || ""}
            directionsServiceBaseUrl="https://rsapi.goong.io/Direction"
            strokeWidth={7}
            strokeColor="#00b0ff"
          />
        ) : null}
      </MapContainer>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[50, 50]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={0}
        />
        <Sheet.Handle />
        <Sheet.Frame
          px="$4"
          py="$6"
          justifyContent="space-between"
        >
          {
            vehicles.map((vehicle, key) => (
              <Card padding="$3" key={key} onPress={handleChooseVehicle}>
                <XStack alignItems="center" justifyContent="space-around">
                  <Car />
                  <Text>{vehicle.vehicle_name}</Text>
                </XStack>
              </Card>
            ))
          }
          <Button onPress={handleBooking}>Book</Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
