import { Slot, SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { useColorScheme, Text } from "react-native";
import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { TamaguiProvider, Theme } from "tamagui";

import { SessionProvider } from "../providers/SessionProvider";

import config from "../tamagui.config";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

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
      <Suspense fallback={<Text>Loading...</Text>}>
        <Theme name={colorScheme}>
          <ThemeProvider
            value={colorScheme === "light" ? DefaultTheme : DarkTheme}
          >
            <SessionProvider>
                <Slot />
            </SessionProvider>
          </ThemeProvider>
        </Theme>
      </Suspense>
    </TamaguiProvider>
  );
}