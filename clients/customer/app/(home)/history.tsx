import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, H2, YStack } from "tamagui";

export default function HistoryScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} px="$4" pt="$4">
        <H2>History</H2>
      </YStack>
    </SafeAreaView>
  );
}
