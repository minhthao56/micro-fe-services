import { Map } from "@tamagui/lucide-icons";
import {
  Button,
  YStack,
  H3,
  Text,
  XStack,
  Input,
  Separator,
  ScrollView,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { CardDemo } from "../../components/CardDemo";

export default function TabOneScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack flex={1} px="$4" pt="$4">
          <XStack justifyContent="space-between" pb="$2">
            <H3>Transport</H3>
            <Button
              icon={Map}
              size="$3"
              borderRadius="$10"
              onPress={() => {
                router.push("/(map)/current");
              }}
            >
              Map
            </Button>
          </XStack>
          <Text>Where you'er going, let get</Text>
          <Text pb="$5">you there!</Text>
          <Input placeholder="Where to?" />
          <Separator marginVertical={15} />
          <ScrollView>
            <CardDemo />
          </ScrollView>
        </YStack>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
