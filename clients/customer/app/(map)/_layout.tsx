import React from "react";
import { Stack, router, Redirect } from "expo-router";

export default function PublicLayout() {

  if(!router.canGoBack()) return <Redirect href={"/"}/>
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="current" />
      <Stack.Screen name="pick-up" />
    </Stack>
  );
}
