import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureProps,
  Input,
  Divider
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";

import { useCallback, useEffect, useState } from "react";
import ReactMapGL, {MapRef} from "@goongmaps/goong-map-react";

import { createBooking } from "../services/booking/booking";
import { PhoneBooking } from "schema/communicate/phone-booking";
import SearchAddress from "../components/inputs/SearchAddress";
import InputHF from "../components/inputs/InputHF";

export interface CreateBookingProps extends UseDisclosureProps {
  onOpenChange: () => void;
  phoneBooking?: PhoneBooking;
}

export default function CreateBooking({
  isOpen,
  onOpenChange,
  phoneBooking,
}: CreateBookingProps) {

  const [addressStart, setAddressStart] = useState({
    address: "",
    lat: 0,
    long: 0
  });
  const [addressEnd, setAddressEnd] = useState({
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
    console.log({ addressStart });
    console.log({ addressEnd });
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
  };

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
                    setAddressStart({
                      address: address[0],
                      lat: parseFloat(address[1]),
                      long: parseFloat(address[2]),
                    });
                    setViewState({
                      ...viewState,
                      latitude: parseFloat(address[1]),
                      longitude: parseFloat(address[2])
                    });
                  }}

                />
                <SearchAddress
                  name="endAddress"
                  label="End Address"
                  onBlur={(e: any) => {
                    const address = e.currentTarget.defaultValue.split("-");
                    setAddressEnd({
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
                <Button color="primary" variant="light" onPress={onClose}>
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
