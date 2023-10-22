import { useCallback } from "react";
import { router } from "expo-router";
import { H2 } from "tamagui";
import { LoginForm, LoginFormData } from "tamagui-shared-ui";
import { KeyboardAvoidingComponent } from "expo-shared-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "utils/auth/mobile";
// import { createCustomToken } from "../../services/authmgmt/customToken";
// import { UserGroup } from "utils/constants/user-group";

export default function SignIn() {
  const session = useSession();
  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      const userCredential = await session?.signIn(data.email, data.password);
      const user = userCredential?.user;
      if (user?.uid) {
        const firebaseToken = await user.getIdToken();
        // const token = await createCustomToken({
        //   uid: user.uid,
        //   firebaseToken,
        //   userGroup: UserGroup.CLIENT_GROUP,
        // });
        // console.log("--token--", token.customToken)

        // await session?.signInWithCustomToken(token.customToken);
        router.replace("/");
      } else {
        await session?.signOut();
        console.log("No user id");
      }
    } catch (error) {
      await session?.signOut();
      console.error(error);
    }
  }, []);
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
