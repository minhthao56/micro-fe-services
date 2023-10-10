import { router } from "expo-router";
import { useColorScheme, Text, View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { TamaguiProvider, Theme, Button } from "tamagui";
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
              onPress={async () => {
                await val?.signIn();
                router.replace("/");
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
