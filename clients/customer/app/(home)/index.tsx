import { Map } from "@tamagui/lucide-icons";
import {
  Button,
  YStack,
  Text,
  XStack,
  Input,
  Separator,
  H2,
  Spinner,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { SchemaAddress } from "schema/booking/GetFrequentlyAddressResponse";

import { LocationCard } from "../../components/LocationCard";
import { searchAddress } from "../../services/googleapis/place";
import { getFrequentlyAddresses } from "../../services/booking/booking";
import { usePage } from "../../hooks/usePage";
import { ListEmptyComponent } from "../../components/ListEmptyComponent";
import { ModeFetch, Pagination } from "../../types/app";

export default function HomeScreen() {
  const [address, setAddress] = useState<SchemaAddress[]>([]);
  const [total, setTotal] = useState(0);

  const [frequentlyAddresses, setFrequentlyAddresses] = useState<
    SchemaAddress[]
  >([]);

  const [inModeSearch, setInModeSearch] = useState(false);

  const [mode, setMode] = useState<ModeFetch>("done");

  const onChangeText = async (text: string) => {
    setInModeSearch(true);
    if (text === "") {
      setInModeSearch(false);
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

  const handleFrequentlyAddresses = useCallback(
    async ({ page, rowsPerPage = 10, mode }: Pagination) => {
      setMode(mode);
      try {
        const data = await getFrequentlyAddresses({
          limit: 10,
          offset: rowsPerPage * page - rowsPerPage,
        });
        setTotal(data?.total || 0);

        if (page === 1) {
          setAddress(data.addresses || []);
          setFrequentlyAddresses(data?.addresses || []);
        } else {
          setAddress((prev) => {
            return [...prev, ...(data?.addresses || [])];
          });
        }
      } catch (e: any) {
        console.log(e);
        Alert.alert(JSON.stringify(e.message));
      } finally {
        setMode("done");
      }
    },
    []
  );

  const { page, pages, setPage, handleNextPage } = usePage(total);

  useEffect(() => {
    if (address.length === 0) {
      handleFrequentlyAddresses({ page: 1, mode: "loading" });
    }
  }, []);

  const renderItem = ({ item }: { item: SchemaAddress }) => {
    return <LocationCard address={item} />;
  };

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
          <FlatList
            data={address}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.lat}-${item.long}`}
            refreshing={mode === "refreshing"}
            onRefresh={async () => {
              setPage(1);
              await handleFrequentlyAddresses({ page: 1, mode: "refreshing" });
            }}
            ListEmptyComponent={
              <ListEmptyComponent
                loading={mode === "loading"}
                text="No address found"
              />
            }
            onEndReached={async () => {
              if (
                page < pages &&
                inModeSearch === false &&
                address.length !== 0
              ) {
                await handleFrequentlyAddresses({
                  page: page + 1,
                  mode: "loadMore",
                });
                handleNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
          />
          {mode === "loadMore" && <Spinner />}
        </YStack>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
