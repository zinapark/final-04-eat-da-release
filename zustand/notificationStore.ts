import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  sellerId: number;
  orderId: number;
  text: string;
  productName: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ) => void;
  hasOrderNotification: (orderId: number) => boolean;
  getNotificationsForSeller: (sellerId: number) => Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: (sellerId: number) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCountForSeller: (sellerId: number) => number;
}

const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      // 새 알림 추가
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      // 해당 orderId의 알림이 이미 존재하는지 확인
      hasOrderNotification: (orderId) => {
        return get().notifications.some((n) => n.orderId === orderId);
      },

      // 특정 판매자의 알림만 반환
      getNotificationsForSeller: (sellerId) => {
        return get().notifications.filter((n) => n.sellerId === sellerId);
      },

      // 특정 알림 읽음 처리
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      // 특정 판매자의 알림만 읽음 처리
      markAllAsRead: (sellerId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.sellerId === sellerId ? { ...n, isRead: true } : n
          ),
        }));
      },

      // 특정 알림 삭제
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      // 모든 알림 삭제
      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      // 판매자의 읽지 않은 알림 수
      unreadCountForSeller: (sellerId) => {
        return get().notifications.filter(
          (n) => n.sellerId === sellerId && !n.isRead
        ).length;
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

export default useNotificationStore;
