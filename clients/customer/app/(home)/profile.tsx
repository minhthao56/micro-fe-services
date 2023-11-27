import { useEffect, useState } from "react";
import { Button, YStack, Avatar, Text, H3, XStack, Spinner } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mail, Phone } from "@tamagui/lucide-icons";
import { SchemaCustomer } from "schema/booking/GetCustomerResponse";

import { useSession } from "../../providers/SessionProvider";
import { updateVIP } from "../../services/booking/customer";
import { useToast } from "react-native-toast-notifications";

export default function ProfileScreen() {
  const session = useSession();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  const [user, setUser] = useState<any>({});
  const [customer, setCustomer] = useState<SchemaCustomer>({
    customer_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    is_vip: false,
    user_id: "",
  });

  useEffect(() => {
    AsyncStorage.getItem("userDB").then((data) => {
      setUser(JSON.parse(data || "{}"));
    });
    AsyncStorage.getItem("customerDB").then((data) => {
      setCustomer(JSON.parse(data || "{}"));
    });
  }, []);

  const handleUpgradeVIP = async () => {
    setLoading(true);
    try {
      await updateVIP({ is_vip: !customer.is_vip });
      await AsyncStorage.setItem(
        "customerDB",
        JSON.stringify({ ...customer, is_vip: !customer.is_vip })
      );
      toast.show("Update VIP success", {
        type: "success",
      });
      setCustomer({ ...customer, is_vip: !customer.is_vip });
    } catch (error) {
      toast.show("Update VIP failed", {
        type: "danger"
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack alignItems="center" justifyContent="space-around" flex={1}>
        <YStack alignItems="center" justifyContent="center">
          <Avatar circular size="$8" mb="$3">
            <Avatar.Image src="http://placekitten.com/200/300" />
            <Avatar.Fallback bc="red" />
          </Avatar>
          <H3 mb="$2">{`${user.first_name} ${user.last_name}`}</H3>
          <XStack alignItems="center" justifyContent="center">
            <Mail size={18} />
            <Text mb="$2" ml="$2">
              {user.email}
            </Text>
          </XStack>
          <XStack alignItems="center" justifyContent="center" mb="$3">
            <Phone size={18} />
            <Text ml="$2">{user.phone_number}</Text>
          </XStack>
          <Button
            bg="$yellow8Light"
            color="black"
            onPress={handleUpgradeVIP}
            disabled={isLoading}
          >
            {isLoading ? <Spinner/>: ` ${customer.is_vip ? "Downgrade" : "Upgrade"} VIP`}
          </Button>
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
