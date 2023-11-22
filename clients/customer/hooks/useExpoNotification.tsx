import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";

export function useExpoNotification() {
  const [expoPushToken, setExpoPushToken] = useState("");

  const registerForPushNotificationsAsync = useCallback(async () => {
    let token;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      console.log("Constants", Constants?.expoConfig?.extra?.eas.projectId);

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas.projectId,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token?.data;
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token || "");
        console.log(token);
      })
      .catch(() => {
        console.log("Failed to register for push notifications");
      });
  }, []);

  return {
    registerForPushNotificationsAsync,
    expoPushToken,
  };
}
