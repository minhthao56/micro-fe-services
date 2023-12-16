import { Alert } from "react-native";
import React, { useState } from "react";
import { BookingStatusSocketResponseWithBookingId } from "../types/app";
import { updateBooking } from "../services/booking/booking";
import { socket } from "../services/communicate/client";
import { Button, Spinner, YStack } from "tamagui";
import { SocketEventBooking } from "schema/constants/event";
import { NewBookingSocketRequest } from "schema/socket/booking";
import { updateStatus } from "../services/booking/driver";
import { Power } from "@tamagui/lucide-icons";
import { useToast } from "react-native-toast-notifications";
import { getAddress } from "../services/address/address";

import { FitToCoordinatesProps } from "tamagui-shared-ui";
import CustomerCard from "./CustomerCard";

interface RenderBottomProps {
  respBooking?: BookingStatusSocketResponseWithBookingId;
  setRespBooking: (
    value: React.SetStateAction<
      BookingStatusSocketResponseWithBookingId | undefined
    >
  ) => void;
  driverId?: string;
  reqBooking?: NewBookingSocketRequest;
  setReqBooking: (
    value: React.SetStateAction<NewBookingSocketRequest | undefined>
  ) => void;
  setShowDialog: (value: React.SetStateAction<boolean>) => void;
  fitToCoordinates: ({
    origin,
    destination,
  }: FitToCoordinatesProps) => Promise<void>;
  updateCurrentLocation: () => Promise<void>;
}

export default function RenderBottom({
  respBooking,
  driverId,
  setRespBooking,
  reqBooking,
  setReqBooking,
  setShowDialog,
  fitToCoordinates,
  updateCurrentLocation
}: RenderBottomProps) {
  const [connected, setConnected] = useState(socket.connected);
  const [waitingConnect, setWaitingConnect] = useState(false);
  const toast = useToast();

  const onBookingWaitingDriver = async (data: NewBookingSocketRequest) => {
    const startAddr = await getAddress({
      lat: data.start_lat,
      long: data.start_long,
    });
    const endAddr = await getAddress({
      lat: data.end_lat,
      long: data.end_long,
    });

    const req: NewBookingSocketRequest = {
      ...data,
      start_address: {
        formatted_address: startAddr?.formatted_address || "",
        lat: data.start_lat,
        long: data.start_long,
        display_name: startAddr?.display_name || "",
      },
      end_address: {
        formatted_address: endAddr?.formatted_address || "",
        lat: data.end_lat,
        long: data.end_long,
        display_name: endAddr?.display_name || "",
      },
    };
    setReqBooking(req);
    setShowDialog(true);
  };

  const onConnect = async () => {
    setWaitingConnect(false);
    setConnected(true);
    toast.show("Connected", {
      type: "success",
    });
    await updateStatus({
      driver_id: driverId || "",
      status: "ONLINE",
    });
    await updateCurrentLocation();
  };

  const onDisconnect = async () => {
    setConnected(false);
    toast.show("Disconnected", {
      type: "danger",
    });
    await updateStatus({
      driver_id: driverId || "",
      status: "OFFLINE",
    });
  };

  const handleConnection = () => {
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

  const handleStatusAccepted = async () => {
    try {
      const resp = {
        ...respBooking,
        driver_id: driverId || "",
        status: "STARTING",
      } as BookingStatusSocketResponseWithBookingId;
      await updateBooking(resp);
      setRespBooking(resp);
      socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
      fitToCoordinates({
        origin: {
          latitude: reqBooking?.start_lat || 0,
          longitude: reqBooking?.start_long || 0,
        },
        destination: {
          latitude: reqBooking?.end_lat || 0,
          longitude: reqBooking?.end_long || 0,
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleStatusStarting = async () => {
    try {
      const resp = {
        ...respBooking,
        driver_id: driverId || "",
        status: "COMPLETED",
      } as BookingStatusSocketResponseWithBookingId;
      await updateBooking(resp);
      await updateStatus({
        driver_id: driverId || "",
        status: "ONLINE",
      });
      setRespBooking(resp);
      socket.emit(SocketEventBooking.BOOKING_STATUS, resp);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const renderButtonStatus = () => {
    if (respBooking?.status === "ACCEPTED") {
      return (
        <Button mb="$4" onPress={handleStatusAccepted}>
          Pick-up customer
        </Button>
      );
    }
    if (respBooking?.status === "STARTING") {
      return (
        <Button mb="$4" onPress={handleStatusStarting}>
          Drop off customer
        </Button>
      );
    }
    return (
      <Button
        mb="$4"
        icon={waitingConnect ? <Spinner /> : Power}
        bg={connected ? "$red9Dark" : "$green9Dark"}
        onPress={handleConnection}
        disabled={waitingConnect}
      >{`Turn ${connected ? "Off" : "On"}`}</Button>
    );
  };
  return (
    <YStack
      position="absolute"
      bottom={0}
      left="$1"
      right="$1"
      justifyContent="center"
    >
      {respBooking?.status === "ACCEPTED" ||
      respBooking?.status === "STARTING" ? (
        <CustomerCard reqBooking = {reqBooking}/>
      ) : null}
      {renderButtonStatus()}
    </YStack>
  );
}
