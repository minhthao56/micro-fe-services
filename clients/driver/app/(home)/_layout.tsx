import { Redirect, Stack } from "expo-router";

import { useSession } from "../../providers/SessionProvider";
import { FullLoading } from "tamagui-shared-ui";

export default function HomeLayout() {
  const val = useSession();
  if (val?.isLoading) {
    return <FullLoading />;
  }

  if (!val?.isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index"/>
      <Stack.Screen name="profile"
      />
    </Stack>
  );
}
