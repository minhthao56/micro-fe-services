import React, { useEffect } from "react";
import { DialogInstance, DialogInstanceProps } from "./DialogInstance";
import { NewBookingSocketRequest } from "schema/socket/booking";
import { Dialog, XStack, Button, Text } from "tamagui";
import { intervalUpdate } from "../utils/time";

export interface DialogBookingProps extends Omit<DialogInstanceProps, "title"> {
  reqBooking?: NewBookingSocketRequest;
  handleRejectBooking?: () => void;
  handleAcceptBooking?: () => void;
}

const MAX_TIME = 15;

export default function DialogBooking({
  reqBooking,
  handleRejectBooking,
  handleAcceptBooking,
  open,
  ...props
}: DialogBookingProps) {
  const [countDown, setCountDown] = React.useState(0);

  useEffect(() => {
    let unsubscribe: any;
    if (open === true) {
      unsubscribe = intervalUpdate(() => {
        setCountDown((countDown) => {
          if (countDown < MAX_TIME) {
            return countDown + 1;
          }
          handleRejectBooking && handleRejectBooking();
          unsubscribe && unsubscribe();
          return countDown;
        });
      }, 1000);
    } else {
      setCountDown(0);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [open]);

  return (
    <DialogInstance
      title="Booking Info"
      open={open}
      {...props}
    >
      <Dialog.Description>
        <Text>{`${reqBooking?.customer.first_name} ${reqBooking?.customer.last_name} at `}</Text>
        <Text fontWeight="900">{`${reqBooking?.start_address?.formatted_address}`}</Text>
      </Dialog.Description>
      <Dialog.Description>
        <Text>{`Phone number is`}</Text>
        <Text fontWeight="900">{` ${reqBooking?.customer.phone_number}`}</Text>
      </Dialog.Description>
      <Dialog.Description>{`Distance is ${
        reqBooking?.distance &&
        Math.round((reqBooking?.distance / 1000) * 100) / 100
      } km.`}</Dialog.Description>
      <Dialog.Description>
        Do you want to accept this booking?
      </Dialog.Description>
      <XStack justifyContent="space-around">
        <Button onPress={handleRejectBooking} bg="$red9Dark">
          {`Reject (${MAX_TIME - countDown})`}
        </Button>
        <Button onPress={handleAcceptBooking} bg="$green9Dark">
          Accept
        </Button>
      </XStack>
    </DialogInstance>
  );
}
