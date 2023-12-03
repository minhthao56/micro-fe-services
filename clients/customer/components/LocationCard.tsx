import React from "react";
import { BaseCard } from "./BaseCard";
import { SchemaAddress } from "schema/booking/GetFrequentlyAddressResponse";
import { router } from "expo-router";
import { XStack, YStack, Text } from "tamagui";
import { ArrowRight, MapPin } from "@tamagui/lucide-icons";

interface LocationCardProps {
  address: SchemaAddress;
}

export function LocationCard({ address }: LocationCardProps) {
  return (
    <BaseCard
      p="$3"
      mb="$3"
      onPress={() => {
        router.push({
          pathname: "/(map)/pick-up",
          params: {
            lat: address.lat || 0,
            long: address.long || 0,
            formattedAddress: address.formatted_address || "",
            displayName: address.display_name || "",
          },
        });
      }}
    >
      <XStack alignItems="center">
        <MapPin size="$1" color="$red10Light" />
        <YStack flex={1} ml="$2">
          <Text fontWeight="700" fontSize="$4" mb="$1">
            {address.display_name}
          </Text>
          <Text>{address.formatted_address}</Text>
        </YStack>
        <ArrowRight size="$1" />
      </XStack>
    </BaseCard>
  );
}
