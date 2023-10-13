import { useCallback } from "react";
import { router } from "expo-router";
import { H2 } from "tamagui";
import { LoginForm, LoginFormData } from "tamagui-shared-ui";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "utils/auth/mobile";

export default function SignIn() {
  const session = useSession();
  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      const userCredential = await session?.signIn(data.email, data.password);
      const user = userCredential?.user;
      if (user?.uid) {
        router.replace("/");
      }else {
        console.log("No user id");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <KeyboardAvoidingComponent>
        <H2 mb="$4" >Taxi SM</H2>
        <LoginForm onSubmit={onSubmit} title="Sign In" />
      </KeyboardAvoidingComponent>
    </SafeAreaView>
  );
}
