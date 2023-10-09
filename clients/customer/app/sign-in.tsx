import { router } from "expo-router";
import { Slot, SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { useColorScheme, Text, View } from "react-native";
import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { TamaguiProvider, Theme, YStack, Button } from "tamagui";
import config from "../tamagui.config";

import { useSession } from "./ctx";

export default function SignIn() {
  const val = useSession();
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name={colorScheme}>
        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DarkTheme}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Button
              onPress={() => {
                console.log("---run--", val);
                val?.signIn();
                console.log("---after--", val);
                router.replace("/");
                console.log("---go to home--", val);

              }}
            >
              Sign In
            </Button>
          </View>
        </ThemeProvider>
      </Theme>
    </TamaguiProvider>
  );
}
