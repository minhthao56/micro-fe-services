import { Map, MapPin } from "@tamagui/lucide-icons";
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
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

import { LocationCard } from "../../components/LocationCard";
import { searchAddress } from "../../services/googleapis/place";

export default function HomeScreen() {
  const [address, setAddress] = useState([]);
  const onChangeText = async (text: string) => {
    const address = await searchAddress(text);
    setAddress(address?.places||[]);
  };

  const debouncedChangeHandler = useCallback(debounce(onChangeText, 300), [onChangeText]);

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
          <Input
            placeholder="Where to?"
            onChangeText={debouncedChangeHandler}
          />
          <Separator marginVertical={15} />
          <ScrollView>
            {address.map((item: any, index) => {
              return (
                <LocationCard key={index} p="$3" mb="$3" onPress={()=>{
                  router.push({
                    pathname: "/(map)/pick-up",
                    params: {
                      lat: item.location.latitude,
                      long: item.location.longitude,
                      formattedAddress: item.formattedAddress,
                      displayName: item.displayName.text
                    }
                  });
                }}>
                  <XStack alignItems="center" justifyContent="center" px="$1">
                    <MapPin size="$1" />
                    <YStack ml="$2">
                      <Text fontWeight="bold" fontSize="$4">{item.displayName.text}</Text>
                      <Text>{item.formattedAddress}</Text>
                    </YStack>
                  </XStack>
                </LocationCard>
              );
            })}
          </ScrollView>
        </YStack>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
