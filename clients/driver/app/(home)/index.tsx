import React, { useCallback } from "react";
import { Marker } from "react-native-maps";
import { XStack, Button, YStack, Spinner, Dialog } from "tamagui";
// import { Power } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  MapContainer,
  useMovePosition,
  userInitialPosition,
} from "tamagui-shared-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import { SocketEventBooking } from "schema/constants/event";
import {
  BookingStatusSocketResponse,
  LocationDriverSocket,
  NewBookingSocketRequest,
} from "schema/socket/booking";
import { StatusBar } from "expo-status-bar";

import { socket } from "../../services/communicate/client";
import { intervalUpdate } from "../../utils/time";
import { createBooking } from "../../services/booking/booking";
import { updateLocation, updateStatus } from "../../services/booking/driver";
import { useSession } from "../../providers/SessionProvider";
import RenderRight from "../../components/RenderRight";
import RenderBottom from "../../components/RenderBottom";
import DialogBooking from "../../components/DialogBooking";

interface BookingStatusSocketResponseWithBookingId
  extends BookingStatusSocketResponse {
  booking_id: string;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [showDialog, setShowDialog] = useState(false);
  const [reqBooking, setReqBooking] = useState<NewBookingSocketRequest>();
  const [respBooking, setRespBooking] =
    useState<BookingStatusSocketResponseWithBookingId>();
  const session = useSession();
  // const toast = useToast();
  const { latitudeDelta, longitudeDelta } = userInitialPosition();

  const { mapRef, moveTo, fitToCoordinates } = useMovePosition();

  useEffect(() => {
    (async () => {
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
      setLocation(location);
    })();
  }, []);

  const updateCurrentLocation = useCallback(async () => {
    const location = await Location.getCurrentPositionAsync({});
    const stringLocation = await AsyncStorage.getItem("currentLocation");
    let currentLocation = JSON.parse(stringLocation || "{}");

    if (
      currentLocation.coords.latitude !== location.coords.latitude ||
      currentLocation.coords.longitude !== location.coords.longitude
    ) {
      await AsyncStorage.setItem("currentLocation", JSON.stringify(location));
      await updateLocation({
        driver_id: session?.claims?.driver_id || "",
        current_lat: location.coords.latitude,
        current_long: location.coords.longitude,
      });

      setLocation(location);
      if (reqBooking?.customer.socket_id) {
        const dataDriverLocation: LocationDriverSocket = {
          driver_id: reqBooking?.driver_id || "",
          lat: location.coords.latitude,
          long: location.coords.longitude,
          customer_socket_id: reqBooking?.customer.socket_id,
        };
        socket.emit(
          SocketEventBooking.BOOKING_DRIVER_LOCATION,
          dataDriverLocation
        );
      }
      await moveTo({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [reqBooking?.customer.socket_id]);

  useEffect(() => {
    const unsubscribe = intervalUpdate(updateCurrentLocation, 5000);
    return () => {
      unsubscribe();
    };
  }, [updateCurrentLocation]);

  useEffect(() => {
    if (respBooking?.status === "COMPLETED") {
      setReqBooking(undefined);
      setRespBooking(undefined);
      Alert.alert("Done Trip");
    }
  }, [respBooking?.status]);

  if (!location) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  const handleAcceptBooking = async () => {
    try {
      setShowDialog(false);
      const resp = {
        ...reqBooking,
        customer_id: String(reqBooking?.customer.customer_id) || "",
        status: "ACCEPTED",
      } as BookingStatusSocketResponse;

      const { booking_id } = await createBooking(resp);
      setRespBooking({
        ...resp,
        booking_id: booking_id || "",
      });

      await updateStatus({
        driver_id: session?.claims?.driver_id || "",
        status: "BUSY",
      });

      fitToCoordinates({
        origin: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        destination: {
          latitude: reqBooking?.start_lat || 0,
          longitude: reqBooking?.start_long || 0,
        },
      });

      socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  const handleRejectBooking = async () => {
    try {
      setShowDialog(false);
      const resp = {
        ...reqBooking,
        customer_id: String(reqBooking?.customer.customer_id) || "",
        status: "REJECTED",
      } as BookingStatusSocketResponse;

      await createBooking(resp);
      setReqBooking(undefined);
      setRespBooking(undefined);
      socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <MapContainer
        renderBottom={() => {
          return (
            <RenderBottom
              respBooking={respBooking}
              fitToCoordinates={fitToCoordinates}
              reqBooking={reqBooking}
              setReqBooking={setReqBooking}
              setRespBooking={setRespBooking}
              setShowDialog={setShowDialog}
              driverId={session?.claims?.driver_id || ""}
              updateCurrentLocation={updateCurrentLocation}
            />
          );
        }}
        renderRight={() => {
          return <RenderRight />;
        }}
        initialRegion={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta,
          longitudeDelta,
        }}
        showBackButton={false}
        showFakePin={false}
        ref={mapRef}
      >
        <Marker
          coordinate={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          }}
          pinColor="blue"
        />

        {respBooking?.status === "ACCEPTED" ? (
          <>
            <Marker
              coordinate={{
                latitude: reqBooking?.start_lat || 0,
                longitude: reqBooking?.start_long || 0,
              }}
            />
            <MapViewDirections
              origin={{
                latitude: location?.coords.latitude || 0,
                longitude: location?.coords.longitude || 0,
              }}
              destination={{
                latitude: reqBooking?.start_lat || 0,
                longitude: reqBooking?.start_long || 0,
              }}
              apikey={process.env.EXPO_PUBLIC_GOONG_KEY || ""}
              directionsServiceBaseUrl="https://rsapi.goong.io/Direction"
              strokeWidth={7}
              strokeColor="#00b0ff"
            />
          </>
        ) : null}

        {respBooking?.status === "STARTING" ? (
          <>
            <Marker
              coordinate={{
                latitude: reqBooking?.start_lat || 0,
                longitude: reqBooking?.start_long || 0,
              }}
            />

            <Marker
              coordinate={{
                latitude: reqBooking?.end_lat || 0,
                longitude: reqBooking?.end_long || 0,
              }}
              pinColor="green"
            />
            <MapViewDirections
              origin={{
                latitude: reqBooking?.start_lat || 0,
                longitude: reqBooking?.start_long || 0,
              }}
              destination={{
                latitude: reqBooking?.end_lat || 0,
                longitude: reqBooking?.end_long || 0,
              }}
              apikey={process.env.EXPO_PUBLIC_GOONG_KEY || ""}
              directionsServiceBaseUrl="https://rsapi.goong.io/Direction"
              strokeWidth={5}
              strokeColor="#00b0ff"
            />
          </>
        ) : null}
      </MapContainer>
      <DialogBooking
        open={showDialog}
        onOpenChange={(open) => setShowDialog(open)}
        reqBooking={reqBooking}
        handleRejectBooking={handleRejectBooking}
        handleAcceptBooking={handleAcceptBooking}
      />
    </>
  );
}
