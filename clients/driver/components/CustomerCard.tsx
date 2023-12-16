import { Text, Card, Separator, XStack, Avatar, YStack, Button } from 'tamagui'
import React from 'react'
import * as Linking from 'expo-linking';
import { PhoneOutgoing } from '@tamagui/lucide-icons';
import { NewBookingSocketRequest } from "schema/socket/booking";

export interface CustomerCardProps {
  reqBooking?: NewBookingSocketRequest;
}

export default function CustomerCard({ reqBooking }: CustomerCardProps) {
  return (
    <Card
    elevate
    bordered
    animation="bouncy"
    width="100%"
    height={115}
    scale={0.9}
    hoverStyle={{ scale: 0.925 }}
    pressStyle={{ scale: 0.875 }}
    py="$3"
    px="$4"
    mb="$2"
    flex={1}
  >
    <Text theme="alt1" fontSize="$1">
      Your customer is waiting for you!
    </Text>
    <Separator marginVertical={8} />
    <XStack alignItems="center">
      <Avatar circular size="$4">
        <Avatar.Image src="http://placekitten.com/200/300" />
        <Avatar.Fallback bc="red" />
      </Avatar>
      <YStack ml="$2" flex={1}>
        <Text >{`${reqBooking?.customer?.first_name} ${reqBooking?.customer?.last_name}`}</Text>
        <Text theme="alt1">{`Distance is ${
        reqBooking?.distance &&
        Math.round((reqBooking?.distance / 1000) * 100) / 100
      } km.`}</Text>
      </YStack>
      <Button
        icon={PhoneOutgoing}
        onPress={() => {
          Linking.openURL(`tel: ${reqBooking?.customer?.phone_number}`);
        }}
        bg="$green8"
      >
        Call
      </Button>
    </XStack>
  </Card>
  )
}