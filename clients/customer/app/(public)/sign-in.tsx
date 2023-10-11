import { router } from "expo-router";
import { Button } from "tamagui";
import { LoginForm } from "tamagui-shared-ui";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../ctx";

export default function SignIn() {
  const val = useSession();
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <KeyboardAvoidingComponent>
       
          <LoginForm />
          <Button
            onPress={async () => {
              await val?.signIn();
              router.replace("/");
            }}
          >
            Sign In
          </Button>
      </KeyboardAvoidingComponent>
    </SafeAreaView>
  );
}
