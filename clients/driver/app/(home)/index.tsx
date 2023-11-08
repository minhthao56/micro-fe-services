import React from "react";
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

// import { getAddressByLatLng } from "../../services/goong/geocoding";
import { socket } from "../../services/communicate/client";
import { DialogInstance } from "../../components/DialogInstance";
import { intervalUpdate } from "../../utils/time";

type STATUS = "PICK_UP" | "START_TRIP" | "FINISH_TRIP" | "NOT_YET";

export default function TabOneScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [connected, setConnected] = useState(socket.connected);
  const [waitingConnect, setWaitingConnect] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [reqBooking, setReqBooking] = useState<NewBookingSocketRequest>();
  const [status, setStatus] = useState<STATUS>("NOT_YET");

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

      // const address = await getAddressByLatLng(
      //   location.coords.latitude,
      //   location.coords.longitude
      // );
      // setAddress(address.results?.[0]?.formatted_address);
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

  const handleAcceptBooking = () => {
    setShowDialog(false);
    setStatus("PICK_UP");
    const resp = {
      ...reqBooking,
      status: "ACCEPTED",
    } as BookingStatusSocketResponse;

    socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
  };

  function handleConnection() {
    let fnUnsubscribe: () => void = () => {};

    function onConnect() {
      setWaitingConnect(false);
      setConnected(true);
      Alert.alert("Connected");
    }

    function onBookingWaitingDriver(data: NewBookingSocketRequest) {
      setReqBooking(data);
      setShowDialog(true);
    }

    function onDisconnect() {
      setConnected(false);
      Alert.alert("Disconnected");
    }

    if (connected) {
      socket.disconnect();
      socket.removeAllListeners();
      fnUnsubscribe();
    } else {
      const unsubscribe = intervalUpdate(async () => {
        const location = await Location.getCurrentPositionAsync({});
        const stringLocation = await AsyncStorage.getItem("currentLocation");
        let currentLocation = JSON.parse(stringLocation || "{}");
        if (
          currentLocation.coords.latitude !== location.coords.latitude ||
          currentLocation.coords.longitude !== location.coords.longitude
        ) {
          await AsyncStorage.setItem(
            "currentLocation",
            JSON.stringify(location)
          );
          setLocation(location);
          if (reqBooking?.customer.socket_id) {
            const dataDriverLocation: LocationDriverSocket = {
              driver_id: reqBooking?.driver_id || "",
              lat: location.coords.latitude,
              long: location.coords.longitude,
              client_socket_id: reqBooking?.customer.socket_id,
            };
            socket.emit(
              SocketEventBooking.BOOKING_DRIVER_LOCATION,
              dataDriverLocation
            );
          }
        }
      }, 5000);
      fnUnsubscribe = unsubscribe;
      setWaitingConnect(true);
      socket.connect();
      socket.on("connect", onConnect);
      socket.on(
        SocketEventBooking.BOOKING_WAITING_DRIVER,
        onBookingWaitingDriver
      );
      socket.on("disconnect", onDisconnect);
    }
  }

  const renderBottom = () => {
    return (
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        justifyContent="center"
      >
        <Button
          mb="$4"
          icon={waitingConnect ? <Spinner /> : Power}
          bg={connected ? "$red10Dark" : "$green10Dark"}
          onPress={handleConnection}
        >{`Turn ${connected ? "Off" : "On"}`}</Button>
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

        {status === "PICK_UP" ? (
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

        {status === "START_TRIP" ? (
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
              strokeWidth={7}
              strokeColor="#00b0ff"
            />
          </>
        ) : null}
      </MapContainer>
      <DialogInstance
        open={showDialog}
        onOpenChange={(open) => setShowDialog(open)}
        title="New Booking"
      >
        <Dialog.Description>
          You have new booking from customer at 123 Nguyen Trai, Thanh Xuan, Ha
          Noi. Phone number is 0123456789.
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
    </>
  );
}
