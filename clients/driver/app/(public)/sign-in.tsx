import { useCallback } from "react";
import { router } from "expo-router";
import { H2, YStack } from "tamagui";
import { LoginForm, LoginFormData } from "tamagui-shared-ui";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserGroup } from "schema/constants/user-group";
import { Alert } from "react-native";

import { useSession } from "../../providers/SessionProvider";
import { createCustomToken } from "../../services/authmgmt/customToken";
import { setToken } from "../../services/initClient";
import { useToast } from "react-native-toast-notifications";

export default function SignIn() {
  const session = useSession();
  const toast = useToast()
  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      const userCredential = await session?.signIn(data.email, data.password);
      const user = userCredential?.user;
      if (user?.uid) {
        const firebaseToken = await user.getIdToken();
        const token = await createCustomToken({
          firebaseToken,
          userGroup: UserGroup.DRIVER_GROUP,
        });
        const userCredential = await session?.signInWithCustomToken(
          token.customToken
        );
        const customToken = await userCredential?.user?.getIdToken();
        if (!customToken) {
          await session?.signOut();
          throw new Error("Token is null");
        }
        setToken(customToken || "");
        router.replace("/");
      } else {
        toast.show(`Error: No user id`, { type: "danger" });
        await session?.signOut();
        throw new Error("No user id");
      }
    } catch (error: any) {
      console.log(error);
      toast.show(`Error: ${error?.message}`, { type: "danger" });
      await session?.signOut();
    }
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <KeyboardAvoidingComponent>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <H2 mb="$4">Driver SM</H2>
          <LoginForm onSubmit={onSubmit} title="Sign In" />
        </YStack>
      </KeyboardAvoidingComponent>
    </SafeAreaView>
  );
}
