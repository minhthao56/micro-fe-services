import { Map, MapPin, ArrowRight } from "@tamagui/lucide-icons";
import {
  Button,
  YStack,
  Text,
  XStack,
  Input,
  Separator,
  ScrollView,
  H2,
  Spinner
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { SchemaAddress } from "schema/booking/GetFrequentlyAddressResponse";

import { LocationCard } from "../../components/LocationCard";
import { searchAddress } from "../../services/googleapis/place";
import { getFrequentlyAddresses } from "../../services/booking/booking";

export default function HomeScreen() {
  const [address, setAddress] = useState<SchemaAddress[]>([]);

  const [frequentlyAddresses, setFrequentlyAddresses] = useState<
    SchemaAddress[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const onChangeText = async (text: string) => {
    if (text === "") {
      setAddress(frequentlyAddresses);
      return;
    }
    const address = await searchAddress(text);

    const mapAddress = address?.places?.map((item: any) => {
      return {
        lat: item.location.latitude,
        long: item.location.longitude,
        formatted_address: item.formattedAddress,
        display_name: item.displayName.text,
      };
    });

    setAddress(mapAddress || []);
  };

  const debouncedChangeHandler = useCallback(debounce(onChangeText, 300), [
    onChangeText,
  ]);

  const handleFrequentlyAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFrequentlyAddresses();
      setAddress(data?.addresses || []);
      setFrequentlyAddresses(data?.addresses || []);
    } catch (e: any) {
      console.log(e);
      Alert.alert(JSON.stringify(e.message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFrequentlyAddresses();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack flex={1} px="$4" pt="$4">
          <XStack justifyContent="space-between" pb="$2">
            <H2>Transport</H2>
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
          <Separator marginVertical={20} />
          {isLoading && <Spinner mb="$3" />}
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={handleFrequentlyAddresses}
                refreshing={isLoading}
              />
            }
          >
            {address.map((item, index) => {
              return (
                <LocationCard
                  key={index}
                  p="$3"
                  mb="$3"
                  onPress={() => {
                    router.push({
                      pathname: "/(map)/pick-up",
                      params: {
                        lat: item.lat || 0,
                        long: item.long || 0,
                        formattedAddress: item.formatted_address || "",
                        displayName: item.display_name || "",
                      },
                    });
                  }}
                >
                  <XStack alignItems="center">
                    <MapPin size="$1" color="$red10Light" />
                    <YStack flex={1} ml="$2">
                      <Text fontWeight="700" fontSize="$4" mb="$1">
                        {item.display_name}
                      </Text>
                      <Text>{item.formatted_address}</Text>
                    </YStack>
                    <ArrowRight size="$1" />
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
