import { communicateClient } from "./client";
import { NotificationRequest, NotificationsResponse } from "schema/communicate/notification"


export const getNotifications = async (params: NotificationRequest) => {
  return await communicateClient.get<NotificationsResponse>("/notification", { params });
};