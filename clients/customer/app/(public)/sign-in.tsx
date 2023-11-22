import { useCallback } from "react";
import { router } from "expo-router";
import { H2 } from "tamagui";
import { LoginForm, LoginFormData } from "tamagui-shared-ui";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../providers/SessionProvider";
import { createCustomToken } from "../../services/authmgmt/customToken";
import { setToken } from "../../services/initClient";
import { UserGroup } from "schema/constants/user-group";
import { Alert } from "react-native";
import { useExpoNotification } from "../../hooks/useExpoNotification";

export default function SignIn() {
  const session = useSession();

  const { expoPushToken } = useExpoNotification();

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      const userCredential = await session?.signIn(data.email, data.password);
      const user = userCredential?.user;
      if (user?.uid) {
        const firebaseToken = await user.getIdToken();
        const token = await createCustomToken({
          firebaseToken,
          userGroup: UserGroup.CUSTOMER_GROUP,
          expo_push_token: expoPushToken,
        });
        const  userCredential = await session?.signInWithCustomToken(token.customToken);
        const customToken = await userCredential?.user?.getIdToken();
        if (!customToken) {
          await session?.signOut();
          throw new Error("Token is null");
        }
        setToken(customToken || "");
        router.replace("/");
      } else {
        console.log("No user id");
        await session?.signOut();
        throw new Error("No user id");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
      await session?.signOut();

    }
  }, [expoPushToken]);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <KeyboardAvoidingComponent>
        <H2 mb="$4">Taxi SM</H2>
        <LoginForm onSubmit={onSubmit} title="Sign In" />
      </KeyboardAvoidingComponent>
    </SafeAreaView>
  );
}
