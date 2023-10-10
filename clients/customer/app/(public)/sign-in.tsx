import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "tamagui";

import { useSession } from "../ctx";

export default function SignIn() {
  const val = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        onPress={async () => {
          await val?.signIn();
          router.replace("/");
        }}
      >
        Sign In
      </Button>
    </View>
  );
}
