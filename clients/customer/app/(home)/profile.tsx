import { Button, YStack, Avatar, Text, H3 } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSession } from "../../providers/SessionProvider";
import { useEffect, useState } from "react";

export default function ProfileScreen() {
  const session = useSession();

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    AsyncStorage.getItem("userDB").then((data) => {
      setUser(JSON.parse(data || "{}"));
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack alignItems="center" justifyContent="space-around" flex={1}>
        <YStack alignItems="center" justifyContent="center">
          <Avatar circular size="$8" mb="$2">
            <Avatar.Image src="http://placekitten.com/200/300" />
            <Avatar.Fallback bc="red" />
          </Avatar>
          <H3>{`${user.first_name} ${user.last_name}`}</H3>
          <Text>{session?.user?.email}</Text>
          <Text>{user.phone_number}</Text>
        </YStack>
        <Button
          bg="$red10Light"
          onPress={async () => {
            await session?.signOut();
          }}
        >
          Sign Out
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
