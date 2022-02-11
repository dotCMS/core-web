export interface INotification {
    id: string;
    title: string;
    message: string;
}

export interface DotNotificactionResponse {
    notifications: INotification[];
    total: number;
    totalUnreadNotifications: number;
}
