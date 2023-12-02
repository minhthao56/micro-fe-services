import React from "react";
import { Card, YStack, Text, Paragraph, XStack, Circle, ZStack } from "tamagui";
import { Bell } from "@tamagui/lucide-icons";
import { Notification } from "schema/communicate/notification";
import moment from "moment";
import { readNotification } from "../services/communicate/notification"
import { useToast } from "react-native-toast-notifications";

interface NotificationCardProps {
  updateList: () => void
  notification: Notification
}

export function NotificationCard({
  notification,
  updateList
}: NotificationCardProps) {
  const toast = useToast();
  const handleReadNotification = async () => {
    try {
      await readNotification(notification.notification_id);
      updateList();
    }catch(error: any){
      console.log(error);
      toast.show(`Error: ${error?.message}`, { type: "danger" });
      
    }
  }
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      width="100%"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      px="$3"
      py="$2.5"
      onPress={handleReadNotification}
    >
      <XStack alignItems="center" space>
        <Bell size={24} color="$green10" />
        <YStack flex={1}>
          <Paragraph fontWeight="800" flex={1}>
            {notification.title}
          </Paragraph>
          <Text>{notification.body}</Text>
          <Text theme="alt1" fontSize="$1" textAlign="right">
            {moment(notification.created_at).format("hh:mm DD/MM/YYYY")}
          </Text>
        </YStack>
        {notification.is_read ? null : (
          <Circle
            bg="$red10"
            size={8}
            position="absolute"
            right={0}
            top={0}
          />
        )}
      </XStack>
    </Card>
  );
}
