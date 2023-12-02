import { H2, YStack, XGroup, Button, Separator, View } from "tamagui";
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
import { usePrevious } from "../../hooks/usePrevious";

export default function NotificationScreen() {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "All",
      active: true,
    },
    {
      id: 2,
      name: "Read",
      active: false,
    },
    {
      id: 3,
      name: "Unread",
      active: false,
    },
  ]);

  const [resp, setResp] = useState<NotificationsResponse>({
    notifications: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { page, pages, setPage } = usePage(resp.total);

  const handleGetNotifications = useCallback(
    async (page: number, rowsPerPage: number = 10) => {
      setLoading(true);
      try {
        const response = await getNotifications({
          limit: 10,
          offset: rowsPerPage * page - rowsPerPage,
          status: tabs.find((tab) => tab.active)?.name?.toLowerCase() || "all",
        });
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
        setLoading(false);
      }
    },
    [tabs]
  );

  const handleRefresh = () => {
    setResp(() => ({
      notifications: [],
      total: 0,
    }));
    setPage(1);
  };

  useEffect(() => {
    if (resp.notifications.length === 0) {
      handleGetNotifications(page);
    }
  }, [handleGetNotifications, page]);

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
          {tabs.map((tab) => (
            <XGroup.Item key={tab.id}>
              <Button
                size="$3"
                bg={tab.active ? "$green8" : "$background"}
                onPress={() => {
                  handleRefresh();
                  setTabs((prev) =>
                    prev.map((prevTab) => ({
                      ...prevTab,
                      active: prevTab.id === tab.id,
                    }))
                  );
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
          refreshing={loading}
          onRefresh={async () => {
            handleRefresh();
            await handleGetNotifications(1);
          }}
          ItemSeparatorComponent={() => <View mb="$3" />}
          onEndReached={async () => {
            if (page < pages) {
              await handleGetNotifications(page + 1);
            }
          }}
        />
      </YStack>
    </SafeAreaView>
  );
}
