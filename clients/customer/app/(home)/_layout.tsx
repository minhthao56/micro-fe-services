import { Redirect, Tabs } from "expo-router";
import { Home, User, Clock3, Bell } from "@tamagui/lucide-icons";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

import { useSession } from "../../providers/SessionProvider";
import { FullLoading } from "tamagui-shared-ui";

export default function HomeLayout() {
  const val = useSession();
  const colorScheme = useColorScheme();

  if (val?.isLoading) {
    return <FullLoading />;
  }

  if (!val?.isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color}/>,
          headerShown: false,
        }}
      />
        <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <Clock3 color={color}/>,
          headerShown: false,
        }}
      />
       <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color }) => <Bell color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
