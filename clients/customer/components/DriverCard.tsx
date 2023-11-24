import { Card, Avatar, Text, Separator, XStack, YStack, Button } from "tamagui";
import { PhoneOutgoing } from "@tamagui/lucide-icons";
import * as Linking from "expo-linking";
import React from "react";
import { SchemaDriverWithDistance } from "schema/booking/GetNearbyDriversResponse";

interface DriverCardProps {
  driver?: SchemaDriverWithDistance;
  insetsBottom: number;
}

export default function DriverCard({ driver, insetsBottom }: DriverCardProps) {
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
      mb={insetsBottom + 4}
      py="$3"
      px="$4"
      flex={1}
    >
      <Text theme="alt1" fontSize="$1">
        Your driver here!
      </Text>
      <Separator marginVertical={8} />
      <XStack alignItems="center">
        <Avatar circular size="$4">
          <Avatar.Image src="http://placekitten.com/200/300" />
          <Avatar.Fallback bc="red" />
        </Avatar>
        <YStack ml="$2" flex={1}>
          <Text >{`${driver?.last_name + " " + driver?.first_name}`}</Text>
          <Text theme="alt1">{`${
            driver?.distance &&
            Math.round((driver?.distance / 1000) * 100) / 100
          } KM`}</Text>
        </YStack>
        <Button
          icon={PhoneOutgoing}
          onPress={() => {
            Linking.openURL(`tel:${driver?.phone_number}`);
          }}
          bg="$green8"
        >
          Call
        </Button>
      </XStack>
    </Card>
  );
}
