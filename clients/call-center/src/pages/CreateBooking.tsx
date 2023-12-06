/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureProps,
  Divider,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { findNearByDriver } from "../services/booking/customer";
import { PhoneBooking } from "schema/communicate/phone-booking";
import SearchAddress from "../components/inputs/SearchAddress";
import InputHF from "../components/inputs/InputHF";
import { socket } from "../services/communicate/client";
import { SocketEventBooking } from "schema/constants/event";
import {
  BookingSocketRequest,
  BookingStatusSocketResponse,
} from "schema/socket/booking";
import { SchemaDriverWithDistance } from "schema/booking/GetNearbyDriversResponse";
import { sendSMS } from "../services/communicate/sms";
import { updatePhoneBookingStatus } from "../services/communicate/phone-booking";
import { createToast } from "vercel-toast";

export interface CreateBookingProps extends UseDisclosureProps {
  onOpenChange: () => void;
  phoneBooking?: PhoneBooking;
  refetch?: () => void;
}

export default function CreateBooking({
  isOpen,
  onOpenChange,
  phoneBooking,
  refetch,
}: CreateBookingProps) {
  const [startAddress, setStartAddress] = useState({
    address: "",
    lat: 0,
    long: 0,
  });
  const [endAddress, setEndAddress] = useState({
    address: "",
    lat: 0,
    long: 0,
  });

  const [driver, setDriver] = useState<SchemaDriverWithDistance>();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync, isPending, data } = useMutation({
    mutationKey: ["findNearByDriver"],
    mutationFn: findNearByDriver,
    onError: (error) => {
      createToast(error?.message || "Error", {type: "error", timeout: 5000});
    }
  });

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      "lastName:c": phoneBooking?.last_name || "",
      "firstName:c": phoneBooking?.first_name || "",
      "phoneNumber:c": phoneBooking?.phone_number || "",
      "email:c": "",
      "lastName:d": "",
      "firstName:d": "",
      "phoneNumber:d": "",
      "email:d": "",
    },
  });

  const onSubmit = (data: any) => {
    console.log({ data });
    setIsLoading(true);
    const newBookingRequest: BookingSocketRequest = {
      customer_id: phoneBooking?.customer_id.toString() || "",
      driver_id: driver?.driver_id || "",
      end_lat: endAddress.lat || 0,
      end_long: endAddress.long || 0,
      start_lat: startAddress.lat || 0,
      start_long: startAddress.long || 0,
      status: "",
      from_call_center: true,
      distance: driver?.distance || 0,
    };
    socket.emit(SocketEventBooking.BOOKING_NEW, newBookingRequest);
  };

  const handleFindDriver = async () => {
    if (!startAddress.address || !endAddress.address) {
      createToast("Please fill start and end address", {type: "error", timeout: 5000});
      return;
    }

   await mutateAsync ({
      vehicle_type_id: 1,
      request_lat: startAddress.lat,
      request_long: startAddress.long,
    })

    if (data?.drivers?.length === 0) {
      alert("No driver found");
      return;
    }

    const driver = data?.drivers?.[0];

    if (driver) {
      setDriver(driver);
    }
  };

  useEffect(() => {
    reset({
      "lastName:c": phoneBooking?.last_name || "",
      "firstName:c": phoneBooking?.first_name || "",
      "phoneNumber:c": phoneBooking?.phone_number || "",
      "email:c": "",
      "lastName:d": driver?.last_name || "",
      "firstName:d": driver?.first_name || "",
      "phoneNumber:d": driver?.phone_number || "",
      "email:d": driver?.email || "",
    });
  }, [
    driver?.email,
    driver?.first_name,
    driver?.last_name,
    driver?.phone_number,
    phoneBooking?.first_name,
    phoneBooking?.last_name,
    phoneBooking?.phone_number,
    reset,
  ]);

  useEffect(() => {
    const handleResponseDriver = async (data: BookingStatusSocketResponse) => {
      if (data.status === "ACCEPTED") {
        alert("Booking accepted");

        await updatePhoneBookingStatus(
          phoneBooking?.call_sid || "",
          "COMPLETED"
        );
        await sendSMS({
          phone_number: phoneBooking?.phone_number || "",
          message: `Your booking has been accepted by ${
            driver?.last_name + " " + driver?.first_name
          }. Phone number: ${driver?.phone_number}`,
        });
        setIsLoading(false);
        onOpenChange();
        refetch?.();
      }
      if (data.status === "REJECTED") {
        alert("Booking rejected re fill driver and try again");
        setIsLoading(false);
      }
    };
    socket.on(SocketEventBooking.BOOKING_WAITING_ADMIN, handleResponseDriver);
    console.log("mount");
    return () => {
      console.log("unmount");
      socket.off(
        SocketEventBooking.BOOKING_WAITING_ADMIN,
        handleResponseDriver
      );
    };
  }, [
    driver?.first_name,
    driver?.last_name,
    driver?.phone_number,
    endAddress.address,
    onOpenChange,
    phoneBooking?.call_sid,
    phoneBooking?.phone_number,
    refetch,
    startAddress.address,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create Booking
            </ModalHeader>
            <ModalBody>
              <span className="text-base text-default-500">
                Customer Information
              </span>
              <Divider />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputHF
                  control={control as any}
                  name="lastName:c"
                  size="sm"
                  type="text"
                  label="Last Name"
                />
                <InputHF
                  control={control as any}
                  size="sm"
                  type="text"
                  label="First Name"
                  name="firstName:c"
                />
                <InputHF
                  control={control as any}
                  size="sm"
                  type="email"
                  label="Email"
                  name="email:c"
                />
                <InputHF
                  control={control as any}
                  size="sm"
                  type="text"
                  label="Phone Number"
                  name="phoneNumber:c"
                />
                <SearchAddress
                  name="startAddress"
                  label="Start Address"
                  onBlur={(e: any) => {
                    const address = e.currentTarget.defaultValue.split("-");
                    setStartAddress({
                      address: address[0],
                      lat: parseFloat(address[1]),
                      long: parseFloat(address[2]),
                    });
                  }}
                />
                <SearchAddress
                  name="endAddress"
                  label="End Address"
                  onBlur={(e: any) => {
                    const address = e.currentTarget.defaultValue.split("-");
                    setEndAddress({
                      address: address[0],
                      lat: parseFloat(address[1]),
                      long: parseFloat(address[2]),
                    });
                  }}
                />
              </div>
              <span className="text-base text-default-500">
                Driver Information
              </span>
              <Divider />
              <div className="grid grid-cols-2 gap-4">
                <InputHF
                  control={control as any}
                  size="sm"
                  type="text"
                  label="Last Name"
                  {...register("lastName:d")}
                />
                <InputHF
                  control={control as any}
                  size="sm"
                  type="text"
                  label="First Name"
                  {...register("firstName:d")}
                />
                <InputHF
                  control={control as any}
                  size="sm"
                  type="email"
                  label="Email"
                  {...register("email:d")}
                />
                <InputHF
                  control={control as any}
                  size="sm"
                  type="text"
                  label="Phone Number"
                  {...register("phoneNumber:d")}
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <div>
                <Button
                  color="primary"
                  variant="light"
                  onPress={handleFindDriver}
                  isDisabled={isPending}
                  isLoading={isPending}
                >
                  Find Driver
                </Button>
                <Button
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  isDisabled={!driver?.driver_id}
                  isLoading={isLoading}
                >
                  Book
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
