import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

import { useSession } from "utils/auth/mobile";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function HomeLayout() {
  const val = useSession();
  const colorScheme = useColorScheme();
  console.log("--HomeLayout--uid--",val?.user?.uid);
  if (val?.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!val?.isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
