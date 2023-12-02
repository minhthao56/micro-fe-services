import { clientCommunicatePrivate } from "./client"
import { NotificationsResponse, NotificationRequest } from "schema/communicate/notification"

export const getNotifications = async (params: NotificationRequest) => {
    const response = await clientCommunicatePrivate.get<NotificationsResponse>("/notification", { params });
    return response;
}

export const readNotification = async (notification_id: number) => {
    const response = await clientCommunicatePrivate.put("/notification/read/" + notification_id, {});
    return response;
}