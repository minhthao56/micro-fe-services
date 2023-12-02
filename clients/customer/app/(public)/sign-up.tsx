import { Button, XStack, YStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { SignUpForm, SignUpFormData } from "tamagui-shared-ui";
import { signUp } from "../../services/usermgmt/user";
import { UserGroup } from "schema/constants/user-group";

import React from "react";
import { router } from "expo-router";
import { Alert } from "react-native";

export default function SignUp() {
  if (!router.canGoBack()) {
    router.replace("/sign-in");
  }

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        phone_number: data.phoneNumber,
        user_group: UserGroup.CUSTOMER_GROUP,
        vehicle_type_id: 1,
      });
      Alert.alert("Success", "You can login and enjoy our services", [
        {
          text: "Sign In",
          onPress: () => {
            router.replace("/sign-in");
          },
        },
      ]);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <XStack width="100%" pt="$4">
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
          <SignUpForm onSubmit={onSubmit} title="Sign Up" />
        </YStack>
      </KeyboardAvoidingComponent>
    </SafeAreaView>
  );
}
