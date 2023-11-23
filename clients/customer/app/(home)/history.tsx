import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { H2, YStack, Text, Separator, ScrollView, Spinner } from "tamagui";
import { SchemaBookingWithAddress } from "schema/booking/GetHistoryBookingResponse";

import { getHistoryBooking } from "../../services/booking/booking";
import { Alert } from "react-native";
import HistoryCard from "../../components/HistoryCard";

export default function HistoryScreen() {
  const [histories, setHistories] = useState<SchemaBookingWithAddress[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleGetHistoryBooking = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getHistoryBooking();
      setHistories(response.booking || []);
    } catch (e:any) {
      console.log(e);
      Alert.alert(e.message);
    }finally{
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetHistoryBooking();
  }, [handleGetHistoryBooking]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} px="$4" pt = "$4">
        <H2 mb="$2">History</H2>
        <Text>Look at your histories, let get</Text>
        <Text>new journey!</Text>
        <Separator marginVertical={20} />
        {isLoading && <Spinner mb = "$3"/>}
        <ScrollView>
          <YStack space>
            {histories.map((history) => (
              <HistoryCard history={history} key={history.booking_id} />
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
