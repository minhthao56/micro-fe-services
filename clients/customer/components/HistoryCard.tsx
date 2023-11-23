import { Card, Text, XStack, YStack } from "tamagui";
import { MapPin, Pin, Clock3, User } from "@tamagui/lucide-icons";
import React from "react";
import { SchemaBookingWithAddress } from "schema/booking/GetHistoryBookingResponse";
import moment from "moment";

export interface HistoryCardProps {
  history: SchemaBookingWithAddress;
}

export default function HistoryCard({ history }: HistoryCardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      width="100%"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      px="$3"
      py="$2"
    >
      <YStack space>
        <XStack alignItems="center">
          <MapPin size={16} color="$red10Light" />
          <Text flex={1} ml="$2">
            {history.start_address?.formatted_address}
          </Text>
        </XStack>
        <XStack alignItems="center">
          <Pin size={16} color={"$blue10Light"} />
          <Text flex={1} ml="$2">
            {history.end_address?.formatted_address}
          </Text>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" flex={1}>
            <User size={10} />
            <Text flex={1} ml="$2" theme="alt1" fontSize="$1">
              {history.driver?.last_name} {history.driver?.first_name}
            </Text>
          </XStack>
          <XStack alignItems="center" flex={1}>
            <Clock3 size={10} />
            <Text flex={1} ml="$2" theme="alt1" fontSize="$1">
              {moment(history.created_at).format("DD/MM/YYYY")} - { history.distance && history.distance/1000 } km
            </Text>
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}
