export interface Notification {
    notification_id: number;
    title: string;
    body: string;
    is_read: boolean;
    created_at: string;
}


export interface NotificationRequest {
    offset: number;
    limit: number;
    status: string;

}

export interface NotificationsResponse {
    notifications: Notification[];
    total: number;
}