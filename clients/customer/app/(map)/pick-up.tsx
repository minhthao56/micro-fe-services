import { router, useLocalSearchParams } from "expo-router";
import { MapPin, Car, Pin } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { XStack, Button, YStack, Text, Card, Spinner, H3 } from "tamagui";
import { StatusBar } from "expo-status-bar";

import { Sheet } from "@tamagui/sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Details, Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapViewDirections from "react-native-maps-directions";
import { useToast } from "react-native-toast-notifications";
import {
  MapContainer,
  userInitialPosition,
  useMovePosition,
} from "tamagui-shared-ui";

import { SchemaVehicleType } from "schema/booking/GetVehicleTypesResponse";
import { SchemaDriverWithDistance } from "schema/booking/GetNearbyDriversResponse";
import { SocketEventBooking } from "schema/constants/event";
import {
  BookingStatusSocketResponse,
  LocationDriverSocket,
  BookingSocketRequest,
} from "schema/socket/booking";

import { getAddress } from "../../services/address/address";

import { ParamsAddress } from "../../types/app";
import { findNearByDriver } from "../../services/booking/driver";
import { getVehicleTypes } from "../../services/booking/vehicle-type";
import { socket } from "../../services/communicate/client";
import { View } from "../../components/Themed";
import { useSession } from "../../providers/SessionProvider";
import DriverCard from "../../components/DriverCard";

export default function PickUp() {
  const { lat, long, formattedAddress } = useLocalSearchParams<ParamsAddress>();
  const [locationPickUp, setLocationPickUp] =
    useState<Location.LocationObject>();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState("");
  const [origin, setOrigin] = useState<Location.LocationObject>();
  const [position, setPosition] = useState(0);
  const [openSheet, setOpenSheet] = useState(false);
  const [vehicles, setVehicles] = useState<SchemaVehicleType[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<SchemaVehicleType>();
  const [selectedDriver, setSelectedDriver] =
    useState<SchemaDriverWithDistance>();

  const [isLookingForDriver, setIsLookingForDriver] = useState(false);
  const [respBooking, setRespBooking] = useState<BookingStatusSocketResponse>();
  const [endPickUp, setEndPickUp] = useState(false);
  const session = useSession();

  const toast = useToast();

  const { latitudeDelta, longitudeDelta } = userInitialPosition();
  const { mapRef, moveTo, fitToCoordinates } = useMovePosition();

  useEffect(() => {
    (async () => {
      const stringLocation = await AsyncStorage.getItem("currentLocation");
      let currentLocation = JSON.parse(stringLocation || "{}");

      if (!stringLocation) {
        currentLocation = await Location.getCurrentPositionAsync({});
        await AsyncStorage.setItem("currentLocation", JSON.stringify(location));
      }

      const addr = await getAddress({
        lat: currentLocation.coords.latitude,
        long: currentLocation.coords.longitude,
      });
      setAddress(addr?.formatted_address || "");
      setLocationPickUp(currentLocation);

      const vehicleTypes = await getVehicleTypes();
      setVehicles(vehicleTypes.vehicle_types || []);
      setSelectedVehicle(vehicleTypes?.vehicle_types?.[0]);
    })();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const handlePickUp = async () => {
    setOrigin(locationPickUp);
    setOpenSheet(true);
    setEndPickUp(true);
  };

  const onRegionChangeComplete = async (region: Region, _: Details) => {
    if (endPickUp) {
      return;
    }
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

    const addr = await getAddress({
      lat: region.latitude,
      long: region.longitude,
    });
    setAddress(addr?.formatted_address || "");
  };

  const handleBooking = async () => {
    if (socket.disconnected) {
      socket.connect();
    }
    setOpenSheet(false);
    try {
      setIsLookingForDriver(true);
      const data = await findNearByDriver({
        start_lat: origin?.coords.latitude || 0,
        start_long: origin?.coords.longitude || 0,
        end_lat: parseFloat(lat) || 0,
        end_long: parseFloat(long) || 0,
      });

      
      if (!data?.drivers || data.drivers?.length === 0) {
        Alert.alert("No driver found");
        setIsLookingForDriver(false);
        return;
      }
      const driver = data.drivers?.[0];

      socket.on("connect", () => {
        const newBookingRequest: BookingSocketRequest = {
          customer_id: session?.claims?.customer_id || "",
          driver_id: driver?.driver_id || "",
          end_lat: parseFloat(lat) || 0,
          end_long: parseFloat(long) || 0,
          start_lat: origin?.coords.latitude || 0,
          start_long: origin?.coords.longitude || 0,
          status: "",
          from_call_center: false,
          distance: driver?.distance || 0,
        };

        toast.show(`Asking driver ${driver?.last_name}`, { type: "info" });

        socket.emit(SocketEventBooking.BOOKING_NEW, newBookingRequest);
      });
      socket.on(
        SocketEventBooking.BOOKING_WAITING_CUSTOMER,
        async (data: BookingStatusSocketResponse) => {
          if (data.status === "ACCEPTED") {
            setIsLookingForDriver(false);
            setSelectedDriver(driver);
            setRespBooking(data);
            await moveTo({
              latitude: driver?.current_lat || 0,
              longitude: driver?.current_long || 0,
            });
          }

          if (data.status === "STARTING") {
            setRespBooking(data);
            fitToCoordinates({
              origin: {
                latitude: origin?.coords.latitude || 0,
                longitude: origin?.coords.longitude || 0,
              },
              destination: {
                latitude: parseFloat(lat) || 0,
                longitude: parseFloat(long) || 0,
              },
            });
          }

          if (data.status === "REJECTED") {
            setIsLookingForDriver(false);
            Alert.alert("Booking rejected", "Please try again", [
              {
                text: "OK",
                onPress: () => {
                  router.back();
                },
              },
            ]);
          }
          if (data.status === "COMPLETED") {
            Alert.alert(
              "Booking completed",
              "Thank you for using our service",
              [
                {
                  text: "OK",
                  onPress: () => {
                    router.back();
                  },
                },
              ]
            );
          }
        }
      );

      // update location of driver
      socket.on(
        SocketEventBooking.BOOKING_DRIVER_LOCATION,
        async (data: LocationDriverSocket) => {
          setSelectedDriver((prev) => {
            if (
              prev?.current_lat === data.lat &&
              prev?.current_long === data.long
            ) {
              return prev;
            }

            if (prev?.driver_id === data.driver_id) {
              return {
                ...prev,
                current_lat: data.lat,
                current_long: data.long,
              };
            }
            return prev;
          });

          await moveTo({
            latitude: data.lat,
            longitude: data.long,
          });
        }
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
      setIsLookingForDriver(false);
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
          {selectedDriver?.driver_id ? (
            <DriverCard driver={selectedDriver} insetsBottom={insets.bottom} />
          ) : (
            <>
              <Card justifyContent="center" mb="$2" py="$3" px="$4">
                <XStack>
                  <MapPin size="$1" color="$red10Dark" />
                  <Text flex={1} ml="$2">
                    {address}
                  </Text>
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
                  <Pin size="$1" color="$blue10Dark" />
                  <Text flex={1} ml="$2">
                    {formattedAddress}
                  </Text>
                </XStack>
              </Card>
              <Button
                mb={insets.bottom + 8}
                onPress={handlePickUp}
                icon={isLookingForDriver ? <Spinner size="small" /> : undefined}
                disabled={isLookingForDriver}
              >
                {isLookingForDriver
                  ? "Looking for driver"
                  : "Choose This Pick-Up"}
              </Button>
            </>
          )}
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
          latitude: locationPickUp?.coords.latitude || 0,
          longitude: locationPickUp?.coords.longitude || 0,
          latitudeDelta,
          longitudeDelta,
        }}
        ref={mapRef}
        showFakePin={!endPickUp}
      >
        {endPickUp ? (
          <Marker
            coordinate={{
              latitude: locationPickUp?.coords.latitude || 0,
              longitude: locationPickUp?.coords.longitude || 0,
            }}
          />
        ) : null}

        {respBooking?.status === "STARTING" ? (
          <>
            <Marker
              coordinate={{
                latitude: parseFloat(lat) || 0,
                longitude: parseFloat(long) || 0,
              }}
              pinColor="green"
            />
            <Marker
              coordinate={{
                latitude: selectedDriver?.current_lat || 0,
                longitude: selectedDriver?.current_long || 0,
              }}
              pinColor="blue"
            />
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
              strokeWidth={5}
              strokeColor="#00b0ff"
            />
          </>
        ) : null}
        {respBooking?.status === "ACCEPTED" ? (
          <>
            <Marker
              coordinate={{
                latitude: selectedDriver?.current_lat || 0,
                longitude: selectedDriver?.current_long || 0,
              }}
              pinColor="blue"
            />

            <MapViewDirections
              origin={{
                latitude: origin?.coords.latitude || 0,
                longitude: origin?.coords.longitude || 0,
              }}
              destination={{
                latitude: selectedDriver?.current_lat || 0,
                longitude: selectedDriver?.current_long || 0,
              }}
              apikey={process.env.EXPO_PUBLIC_GOONG_KEY || ""}
              directionsServiceBaseUrl="https://rsapi.goong.io/Direction"
              strokeWidth={7}
              strokeColor="#00b0ff"
            />
          </>
        ) : null}
      </MapContainer>

      <Sheet
        forceRemoveScrollEnabled={openSheet}
        modal={true}
        open={openSheet}
        onOpenChange={setOpenSheet}
        snapPoints={[50, 50]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="bouncy"
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
