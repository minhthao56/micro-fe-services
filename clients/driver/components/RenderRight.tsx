import { Avatar } from "tamagui";
import React from "react";
import { XStack } from "tamagui";
import { router } from "expo-router";

export default function RenderRight() {
  return (
    <XStack position="absolute" top="$7" right="$5" justifyContent="center">
      <Avatar
        circular
        size="$6"
        borderColor="$red10Light"
        borderWidth="$1"
        onPress={() => {
          router.push("/profile");
        }}
      >
        <Avatar.Image src="http://placekitten.com/200/300" />
        <Avatar.Fallback bc="red" />
      </Avatar>
    </XStack>
  );
}
