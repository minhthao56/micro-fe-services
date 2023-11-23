import { Slot, SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { TamaguiProvider, Theme } from "tamagui";

import * as Notifications from "expo-notifications";

import { FullLoading } from "tamagui-shared-ui"

import { SessionProvider } from "../providers/SessionProvider";
import config from "../tamagui.config";

import { ToastProvider } from 'react-native-toast-notifications'


export { ErrorBoundary } from "expo-router";


SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Root() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;
  return (
    // @ts-ignore
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name={colorScheme}>
        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DarkTheme}
        >
         {/* @ts-ignore */}
          <ToastProvider placement="top" style = {{borderRadius:"50px"}}>
          <Suspense fallback={<FullLoading/>}>
              <SessionProvider>
                <Slot />
              </SessionProvider>
          </Suspense>
          </ToastProvider>
        </ThemeProvider>
      </Theme>
    </TamaguiProvider>
  );
}
