import { useLocalSearchParams } from "expo-router";
import { MapPin, Car, Pin } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { XStack, Button, YStack, Text, Card, Spinner, Avatar } from "tamagui";
import { Sheet } from "@tamagui/sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Details, Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapViewDirections from "react-native-maps-directions";
import { MapContainer } from "tamagui-shared-ui";
import { SchemaVehicleType } from "schema/booking/GetVehicleTypesResponse";
import { SchemaDriverWithDistance } from "schema/booking/GetNearbyDriversResponse";
import { CreateBookingRequest } from "schema/booking/CreateBookingRequest";
import { SocketEventBooking } from "schema/constants/event";

import { getAddressByLatLng } from "../../services/goong/geocoding";
import { ParamsAddress } from "../../types/app";
import { findNearByDriver } from "../../services/booking/customer";
import { getVehicleTypes } from "../../services/booking/vehicle-type";
import { socket } from "../../services/communicate/client";
import { View } from "../../components/Themed";

// import { createBooking } from "../../services/booking/booking"

export default function PickUp() {
  const { lat, long, formattedAddress } = useLocalSearchParams<ParamsAddress>();
  const [locationPickUp, setLocationPickUp] =
    useState<Location.LocationObject>();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState("");
  const [origin, setOrigin] = useState<Location.LocationObject>();
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [vehicles, setVehicles] = useState<SchemaVehicleType[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<SchemaVehicleType>();
  const [selectedDriver, setSelectedDriver] =
    useState<SchemaDriverWithDistance>();

  const [isLookingForDriver, setIsLookingForDriver] = useState(false);

  useEffect(() => {
    (async () => {
      const stringLocation = await AsyncStorage.getItem("currentLocation");
      let currentLocation = JSON.parse(stringLocation || "{}");

      if (!stringLocation) {
        currentLocation = await Location.getCurrentPositionAsync({});
        await AsyncStorage.setItem("currentLocation", JSON.stringify(location));
      }
      const address = await getAddressByLatLng(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setAddress(address.results?.[0]?.formatted_address);
      setLocationPickUp(currentLocation);

      const vehicleTypes = await getVehicleTypes();
      setVehicles(vehicleTypes.vehicle_types || []);
      setSelectedVehicle(vehicleTypes?.vehicle_types?.[0]);
    })();
  }, []);

  const handlePickUp = async () => {
    setOrigin(locationPickUp);
    setOpen(true);
  };

  const onRegionChangeComplete = async (region: Region, _: Details) => {
    setLocationPickUp({
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

    const address = await getAddressByLatLng(region.latitude, region.longitude);
    setAddress(address.results?.[0]?.formatted_address);
  };

  const handleBooking = async () => {
    if (socket.disconnected) {
      socket.connect();
    }

    setOpen(false);
    try {
      setIsLookingForDriver(true);
      const data = await findNearByDriver({
        request_lat: origin?.coords.latitude || 0,
        request_long: origin?.coords.longitude || 0,
      });
      if (data.drivers?.length === 0) {
        Alert.alert("No driver found");
        return;
      }
      const drivers = data.drivers;

      socket.on("connect", () => {
        Alert.alert("Connected");
        const newBookingRequest: CreateBookingRequest = {
          customer_id: "",
          driver_id: "1",
          end_lat: parseFloat(lat) || 0,
          end_long: parseFloat(long) || 0,
          start_lag: origin?.coords.latitude || 0,
          start_long: origin?.coords.longitude || 0,
          status: "",
        };
        socket.emit(SocketEventBooking.BOOKING_NEW, newBookingRequest);
      });

      setSelectedDriver(drivers?.[0]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!locationPickUp) {
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
          <Card justifyContent="center" mb="$2" py="$3" px="$4">
            <XStack>
              <MapPin size="$1" />
              <Text>{address}</Text>
            </XStack>
            <View
              style={{
                marginVertical: 15,
                height: 1,
              }}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.3)"
            />
            <XStack>
              <Pin size="$1" />
              <Text>{formattedAddress}</Text>
            </XStack>
          </Card>
          {isLookingForDriver ? (
            <Card
              flex={1}
              justifyContent="center"
              alignItems="center"
              py="$3"
              px="$4"
              mb={insets.bottom + 8}
            >
              <XStack>
                <Spinner size="small" />
                <Text ml="$2">Looking for driver</Text>
              </XStack>
            </Card>
          ) : null}
          {selectedDriver?.driver_id ? (
            <Card
              flex={1}
              justifyContent="center"
              py="$3"
              px="$4"
              mb={insets.bottom + 8}
            >
              <Text>
                Name:{" "}
                {selectedDriver.last_name + " " + selectedDriver.first_name}
              </Text>
              <Text>Phone Number: {selectedDriver.phone_number}</Text>
              <Text>Email: {selectedDriver.email}</Text>
              <Text>Distance: {selectedDriver.distance + " KM"}</Text>
            </Card>
          ) : (
            <Button mb={insets.bottom + 8} onPress={handlePickUp}>
              Choose This Pick-Up
            </Button>
          )}
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
          latitude: locationPickUp?.coords.latitude || 0,
          longitude: locationPickUp?.coords.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: locationPickUp?.coords.latitude || 0,
            longitude: locationPickUp?.coords.longitude || 0,
          }}
        />
        <Marker
          coordinate={{
            latitude: parseFloat(lat) || 0,
            longitude: parseFloat(long) || 0,
          }}
        />
        {selectedDriver?.driver_id ? (
          <Marker
            coordinate={{
              latitude: selectedDriver?.current_lat || 0,
              longitude: selectedDriver?.current_long || 0,
            }}
            image={require("../../assets/images/icons8-car-64.png")}
          />
        ) : null}

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
        <Sheet.Frame px="$4" py="$6" justifyContent="space-between">
          {vehicles.map((vehicle, key) => (
            <Card
              padding="$3"
              key={key}
              onPress={() => {
                setSelectedVehicle(vehicle);
              }}
              borderColor={
                selectedVehicle?.vehicle_type_id === vehicle.vehicle_type_id
                  ? "white"
                  : "transparent"
              }
              borderWidth={1}
            >
              <XStack alignItems="center" justifyContent="space-around">
                <Car />
                <Text>{vehicle.vehicle_name}</Text>
              </XStack>
            </Card>
          ))}
          <Button onPress={handleBooking}>Book</Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
