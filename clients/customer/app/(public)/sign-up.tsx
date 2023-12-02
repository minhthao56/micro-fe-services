import { Button, H2, XStack, YStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { ArrowLeft, X } from "@tamagui/lucide-icons";
import { SignUpForm } from "tamagui-shared-ui";

import React from "react";
import { router } from "expo-router";

export default function SignUp() {
    if(!router.canGoBack()){
        router.replace("/sign-in");
    }
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <XStack width="100%" pt ="$4">
        <Button
          icon={ArrowLeft}
          borderRadius={50}
          circular
          ml="$4"
          onPress={() => {
            router.back();
          }}
        />
      </XStack>

      <KeyboardAvoidingComponent>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <SignUpForm
            onSubmit={(data) => {
              console.log(data);
            }}
            title="Sign Up"
          />
        </YStack>
      </KeyboardAvoidingComponent>
    </SafeAreaView>
  );
}
