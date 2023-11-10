import React, { useCallback } from "react";
import { Marker } from "react-native-maps";
import { XStack, Button, YStack, Spinner, Dialog } from "tamagui";
import { Power } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { MapContainer } from "tamagui-shared-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import { SocketEventBooking } from "schema/constants/event";
import {
  BookingStatusSocketResponse,
  LocationDriverSocket,
  NewBookingSocketRequest,
} from "schema/socket/booking";

import { getAddressByLatLng } from "../../services/goong/geocoding";
import { socket } from "../../services/communicate/client";
import { DialogInstance } from "../../components/DialogInstance";
import { intervalUpdate } from "../../utils/time";
import { createBooking, updateBooking } from "../../services/booking/booking";
import { updateLocation, updateStatus } from "../../services/booking/driver";
import { useSession } from "../../providers/SessionProvider";

interface NewBookingSocketRequestWithAddress extends NewBookingSocketRequest {
  address: string;
}

interface BookingStatusSocketResponseWithBookingId
  extends BookingStatusSocketResponse {
  booking_id: string;
}

export default function TabOneScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [connected, setConnected] = useState(socket.connected);
  const [waitingConnect, setWaitingConnect] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [reqBooking, setReqBooking] =
    useState<NewBookingSocketRequestWithAddress>();
  const [respBooking, setRespBooking] =
    useState<BookingStatusSocketResponseWithBookingId>();
  const session = useSession();


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


  useEffect(() => {
    const unsubscribe = intervalUpdate(async () => {
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
        console.log({reqBooking});
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
      }
    }, 5000);

    return () => {
      unsubscribe();
    };

  }, [reqBooking]);


  const handleCompleteBooking = useCallback(async () => {}, []);

  // Clear all


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

      await updateStatus({driver_id: session?.claims?.driver_id || "", status: "BUSY" });

      socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const onConnect = async () => {
    setWaitingConnect(false);
    setConnected(true);
    Alert.alert("Connected");
    await updateStatus({
      driver_id: session?.claims?.driver_id || "",
      status: "ONLINE",
    });
  };

  const onBookingWaitingDriver = async (data: NewBookingSocketRequest) => {
    const addr = await getAddressByLatLng(data.start_lat, data.start_long);
    const req: NewBookingSocketRequestWithAddress = {
      ...data,
      address: addr.results?.[0]?.formatted_address || "",
    };
    setReqBooking(req);
    setShowDialog(true);
  };

  const onDisconnect = async () => {
    setConnected(false);
    Alert.alert("Disconnected");
    await updateStatus({
      driver_id: session?.claims?.driver_id || "",
      status: "OFFLINE",
    });
  };

  const handleConnection = async () => {
    if (connected) {
      socket.disconnect();
      socket.removeAllListeners();
      setConnected(false);
    } else {
      setWaitingConnect(true);
      socket.connect();
      socket.on("connect", onConnect);
      socket.on(
        SocketEventBooking.BOOKING_WAITING_DRIVER,
        onBookingWaitingDriver
      );
      socket.on("disconnect", onDisconnect);
    }
  };

  const renderButtonStatus = () => {
    if (respBooking?.status === "ACCEPTED") {
      return (
        <Button
          mb="$4"
          onPress={async () => {
            try {
              const resp: BookingStatusSocketResponseWithBookingId = {
                ...respBooking,
                driver_id: session?.claims?.driver_id || "",
                status: "STARTING",
              };
              await updateBooking(resp);
              setRespBooking(resp);
              socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          }}
        >
          Pick Up Customer
        </Button>
      );
    }
    if (respBooking?.status === "STARTING") {
      return (
        <Button
          mb="$4"
          onPress={async () => {
            try {
              const resp: BookingStatusSocketResponseWithBookingId = {
                ...respBooking,
                driver_id: session?.claims?.driver_id || "",
                status: "COMPLETED",
              };
              await updateBooking(resp);
              setRespBooking(resp);
              socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          }}
        >
          Drop Off Customer
        </Button>
      );
    }
    return (
      <Button
        mb="$4"
        icon={waitingConnect ? <Spinner /> : Power}
        bg={connected ? "$red10Dark" : "$green10Dark"}
        onPress={handleConnection}
      >{`Turn ${connected ? "Off" : "On"}`}</Button>
    );
  };

  const renderBottom = () => {
    return (
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        justifyContent="center"
      >
        {renderButtonStatus()}
      </XStack>
    );
  };

  return (
    <>
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
      {/* Dialog */}
      <DialogInstance
        open={showDialog}
        onOpenChange={(open) => setShowDialog(open)}
        title="New Booking"
      >
        <Dialog.Description>
          {`You have new booking from customer at ${reqBooking?.address}.
            Phone number is ${reqBooking?.customer.phone_number}.`}
        </Dialog.Description>
        <Dialog.Description>
          Do you want to accept this booking?
        </Dialog.Description>
        <XStack justifyContent="space-around">
          <Button
            onPress={() => {
              setShowDialog(false);
            }}
            bg="$red10Dark"
          >
            Reject
          </Button>
          <Button onPress={handleAcceptBooking} bg="$green10Dark">
            Accept
          </Button>
        </XStack>
      </DialogInstance>
      {/* Dialog */}
    </>
  );
}
