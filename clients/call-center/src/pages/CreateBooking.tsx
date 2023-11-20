import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureProps,
  Divider
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import ReactMapGL  from "@goongmaps/goong-map-react";

import { createBooking } from "../services/booking/booking";
import { findNearByDriver } from "../services/booking/customer";
import { PhoneBooking } from "schema/communicate/phone-booking";
import SearchAddress from "../components/inputs/SearchAddress";
import InputHF from "../components/inputs/InputHF";
import { socket } from "../services/communicate/client";
import { CreateBookingRequest } from "schema/booking/CreateBookingRequest";
import { SocketEventBooking } from "schema/constants/event";
import { BookingSocketRequest } from "schema/socket/booking";


export interface CreateBookingProps extends UseDisclosureProps {
  onOpenChange: () => void;
  phoneBooking?: PhoneBooking;
}

export default function CreateBooking({
  isOpen,
  onOpenChange,
  phoneBooking,
}: CreateBookingProps) {

  const [startAddress, setStartAddress] = useState({
    address: "",
    lat: 0,
    long: 0
  });
  const [endAddress, setEndAddress] = useState({
    address: "",
    lat: 0,
    long: 0
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
    }
  });
  const [viewState, setViewState] = useState({
    longitude: 106.699793,
    latitude: 10.764661,
    zoom: 12
  });
  const onSubmit = (data: any) => {
    console.log({ data });
    console.log({ startAddress });
    console.log({ endAddress });
    // createBooking({
    //   customer_id: phoneBooking?.customer_id.toString() || "",
    //   driver_id: "",
    //   start_address: "string",
    //   end_address: "string",
    //   end_lat: 0,
    //   end_long: 0,
    //   start_lat: 0,
    //   start_long: 0,
    //   status: "",
    // });

    // const newBookingRequest: CreateBookingRequest = {
    //   customer_id: "",
    //   driver_id: driver?.driver_id || "",
    //   end_lat: parseFloat(lat) || 0,
    //   end_long: parseFloat(long) || 0,
    //   start_lat: origin?.coords.latitude || 0,
    //   start_long: origin?.coords.longitude || 0,
    //   status: "",
    // };
    // socket.emit(SocketEventBooking.BOOKING_NEW, newBookingRequest);
  };

  const handleFindDriver = async () => {
    const data = await findNearByDriver({
      vehicle_type_id: 1,
      request_lat: startAddress.lat,
      request_long: startAddress.long
    });
    const driver = data.drivers?.[0];
    const newBookingRequest: BookingSocketRequest = {
      customer_id: phoneBooking?.customer_id.toString() || "",
      driver_id: driver?.driver_id || "",
      end_lat: endAddress.lat || 0,
      end_long: endAddress.long || 0,
      start_lat: startAddress.lat || 0,
      start_long: startAddress.long || 0,
      status: "",
      from_call_center: true
    };
    socket.emit(SocketEventBooking.BOOKING_NEW, newBookingRequest);
  }

  useEffect(() => {
    reset({
      "lastName:c": phoneBooking?.last_name || "",
      "firstName:c": phoneBooking?.first_name || "",
      "phoneNumber:c": phoneBooking?.phone_number || "",
      "email:c": "",
      "lastName:d": "",
      "firstName:d": "",
      "phoneNumber:d": "",
      "email:d": "",
    });

  }, [phoneBooking?.first_name, phoneBooking?.last_name, phoneBooking?.phone_number, reset]);



  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl"
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
              <div className="mb-4">
                <ReactMapGL
                  width="100%"
                  height="300px"
                  {...viewState}

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
                <Button color="primary" variant="light" onPress={handleFindDriver}>
                  Find Driver
                </Button>
                <Button color="primary" onClick={handleSubmit(onSubmit)}>
                  Add
                </Button>
              </div>

            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
