import React from "react";
import { Marker } from "react-native-maps";
import { XStack, Button, YStack, Spinner } from "tamagui";
import { Power, X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { MapContainer } from "tamagui-shared-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { SocketEventBooking } from "schema/constants/event";
import { NewBookingSocketRequest } from "schema/socket/booking";

// import { getAddressByLatLng } from "../../services/goong/geocoding";
import { socket } from "../../services/communicate/client";
import { DialogInstance } from "../../components/DialogInstance";
import { set } from "react-hook-form";

export default function TabOneScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(socket.connected);
  const [waitingConnect, setWaitingConnect] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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

  function handleConnection() {
    function onConnect() {
      setWaitingConnect(false);
      setConnected(true);
      Alert.alert("Connected");
    }

    function onBookingWaitingDriver(data: NewBookingSocketRequest) {
      Alert.alert("New Booking", JSON.stringify(data));
    }

    function onDisconnect() {
      setConnected(false);
      Alert.alert("Disconnected");
    }

    // if (connected) {
    //   socket.disconnect();
    //   socket.removeAllListeners();
    // } else {
    //   setWaitingConnect(true);
    //   socket.connect();
    //   socket.on("connect", onConnect);
    //   socket.on(
    //     SocketEventBooking.BOOKING_WAITING_DRIVER,
    //     onBookingWaitingDriver
    //   );
    //   socket.on("disconnect", onDisconnect);
    // }

    setShowDialog(true);
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
        />
      </MapContainer>
      <DialogInstance
        open={showDialog}
        onOpenChange={(open) => setShowDialog(open)}
        title="New Booking"
      >
        <XStack>
          <Button
            onPress={() => {
              setShowDialog(false);
            }}
          >
            Close
          </Button>
        </XStack>
      </DialogInstance>
    </>
  );
}
