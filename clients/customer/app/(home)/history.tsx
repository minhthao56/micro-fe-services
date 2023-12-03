import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { H2, YStack, Text, Separator, Spinner, View } from "tamagui";
import { SchemaBookingWithAddress } from "schema/booking/GetHistoryBookingResponse";

import { getHistoryBooking } from "../../services/booking/booking";
import { Alert, FlatList } from "react-native";
import HistoryCard from "../../components/HistoryCard";
import { ModeFetch, Pagination } from "../../types/app";
import { usePage } from "../../hooks/usePage";
import { ListEmptyComponent } from "../../components/ListEmptyComponent";

export default function HistoryScreen() {
  const [histories, setHistories] = useState<SchemaBookingWithAddress[]>([]);
  const [total, setTotal] = useState(0);

  const [mode, setMode] = useState<ModeFetch>("done");

  const handleGetHistoryBooking = useCallback(
    async ({ mode, page, rowsPerPage = 10 }: Pagination) => {
      setMode(mode);
      try {
        const response = await getHistoryBooking({
          offset: rowsPerPage * page - rowsPerPage,
          limit: 10,
        });
        if (page === 1) {
          setHistories(response.booking || []);
          setTotal(response.total);
          return;
        }
        setHistories((prev)=> [...prev, ...(response.booking || [])]);
      } catch (e: any) {
        console.log(e);
        Alert.alert(e.message);
      } finally {
        setMode("done");
      }
    },
    []
  );

  useEffect(() => {
    handleGetHistoryBooking({ mode: "loading", page: 1 });
  }, []);

  const { page, pages, setPage, handleNextPage } = usePage(total);

  const renderItem = ({ item }: { item: SchemaBookingWithAddress }) => {
    return <HistoryCard history={item} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} px="$4" pt="$4">
        <H2 mb="$2">History</H2>
        <Text>Look at your histories, let get</Text>
        <Text>new journey!</Text>
        <Separator marginVertical={20} />
        <FlatList
          data={histories}
          renderItem={renderItem}
          keyExtractor={(item) => item.booking_id?.toString() || ""}
          refreshing={mode === "refreshing"}
          onEndReachedThreshold={0.5}
          onEndReached={async () => {
            if (page < pages && histories.length !== 0) {
              await handleGetHistoryBooking({ mode: "loadMore", page: page + 1 });
              handleNextPage();
            }
          }}
          ListEmptyComponent={
            <ListEmptyComponent
              loading={mode === "loading"}
              text="No history found"
            />
          }
          onRefresh={async () => {
            setPage(1);
            await handleGetHistoryBooking({ mode: "refreshing", page: 1 });
          }}
          ItemSeparatorComponent={()=> <View mb="$3" />}
        />
        {mode === "loadMore" && <Spinner />}
      </YStack>
    </SafeAreaView>
  );
}
