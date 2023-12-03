import {
  H2,
  YStack,
  XGroup,
  Button,
  Separator,
  View,
  Spinner,
  Text,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationCard } from "../../components/NotificationCard";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Notification,
  NotificationsResponse,
} from "schema/communicate/notification";
import { getNotifications } from "../../services/communicate/notification";
import { useToast } from "react-native-toast-notifications";
import { usePage } from "../../hooks/usePage";
import { ListEmptyComponent } from "../../components/ListEmptyComponent";
import { ModeFetch, Pagination } from "../../types/app";

interface PaginationWithStatus extends Pagination {
  status?: string;
}

const TABS = [
  {
    id: 1,
    name: "All",
  },
  {
    id: 2,
    name: "Read",
  },
  {
    id: 3,
    name: "Unread",
  },
]

export default function NotificationScreen() {
  const [currentTab, setCurrentTab] = useState(TABS[0]);

  const [resp, setResp] = useState<NotificationsResponse>({
    notifications: [],
    total: 0,
  });

  const [mode, setMode] = useState<ModeFetch>("done");

  const toast = useToast();

  const { page, pages, setPage, handleNextPage } = usePage(resp.total);

  const handleGetNotifications = useCallback(
    async ({ page, rowsPerPage = 10, mode, status }: PaginationWithStatus) => {
      setMode(mode);
      try {
        const response = await getNotifications({
          limit: 10,
          offset: rowsPerPage * page - rowsPerPage,
          status: status || "all",
        });

        if (page === 1) {
          setResp(response);
          return;
        }
        setResp((prev) => {
          return {
            ...prev,
            notifications: [...prev.notifications, ...response.notifications],
            total: response.total,
          };
        });
      } catch (error: any) {
        console.log(error);
        toast.show(`Error: ${error?.message}`, { type: "danger" });
      } finally {
        setMode("done");
      }
    },
    []
  );

  useEffect(() => {
    handleGetNotifications({ page: 1, mode: "loading" });
  }, []);

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <NotificationCard
        notification={item}
        updateList={() => {
          setResp((prev) => {
            return {
              ...prev,
              notifications: prev.notifications.map((prevNotification) => {
                if (prevNotification.notification_id === item.notification_id) {
                  return {
                    ...prevNotification,
                    is_read: true,
                  };
                }
                return prevNotification;
              }),
            };
          });
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} px="$4" pt="$4">
        <H2 mb="$4">Notifications</H2>
        <XGroup size="$3" $gtSm={{ size: "$5" }}>
          {TABS.map((tab) => (
            <XGroup.Item key={tab.id}>
              <Button
                size="$3"
                bg={tab.id === currentTab.id ? "$green8" : "$background"}
                onPress={async () => {
                  setPage(1);
                  setResp({
                    notifications:[],
                    total:0
                  })
                  setCurrentTab(tab);
                  await handleGetNotifications({
                    page: 1,
                    mode: "loading",
                    status: tab.name.toLowerCase(),
                  });
                }}
              >
                {tab.name}
              </Button>
            </XGroup.Item>
          ))}
        </XGroup>
        <Separator marginVertical={15} />
        <FlatList
          data={resp.notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.notification_id.toString()}
          refreshing={mode === "refreshing"}
          onRefresh={async () => {
            setPage(1);
            await handleGetNotifications({ page: 1, mode: "refreshing" });
          }}
          ItemSeparatorComponent={() => <View mb="$3" />}
          onEndReached={async () => {
            if (page < pages && resp.notifications.length !== 0) {
              await handleGetNotifications({
                page: page + 1,
                mode: "loadMore",
              });
              handleNextPage();
            }
          }}
          ListEmptyComponent={
            <ListEmptyComponent
              loading={mode === "loading"}
              text="No notification found"
            />
          }
          onEndReachedThreshold={0.5}
        />
         {
          mode === "loadMore" && <Spinner />
        }
      </YStack>
    </SafeAreaView>
  );
}
