import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'order' | 'pickup' | 'pickup-done';

export interface Notification {
  id: string;
  type: NotificationType;
  sellerId: number;
  userId: number;
  orderId: number;
  text: string;
  productName: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  refreshTrigger: number;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'> & {
      createdAt?: string;
    }
  ) => void;
  triggerRefresh: () => void;
  hasOrderNotification: (orderId: number) => boolean;
  hasPickupNotification: (orderId: number) => boolean;
  hasPostPickupNotification: (orderId: number) => boolean;
  getNotificationsForSeller: (sellerId: number) => Notification[];
  getNotificationsForUser: (userId: number) => Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: (sellerId: number) => void;
  markAllAsReadForUser: (userId: number) => void;
  unreadCountForSeller: (sellerId: number) => number;
  unreadCountForUser: (userId: number) => number;
}

const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [] as Notification[],
      refreshTrigger: 0,

      // 새 구매 후 알림 재스케줄링 트리거
      triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),

      // 새 알림 추가
      addNotification: (notification) => {
        const { createdAt, ...rest } = notification;
        const newNotification: Notification = {
          ...rest,
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          createdAt: createdAt || new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      // 해당 orderId의 주문 알림이 이미 존재하는지 확인
      hasOrderNotification: (orderId) => {
        return get().notifications.some(
          (n) => n.orderId === orderId && n.type === 'order'
        );
      },

      // 해당 orderId의 픽업 전 알림이 이미 존재하는지 확인
      hasPickupNotification: (orderId) => {
        return get().notifications.some(
          (n) => n.orderId === orderId && n.type === 'pickup'
        );
      },

      // 해당 orderId의 픽업 후 알림이 이미 존재하는지 확인
      hasPostPickupNotification: (orderId: number) => {
        return get().notifications.some(
          (n) => n.orderId === orderId && n.type === 'pickup-done'
        );
      },

      // 특정 판매자의 알림만 반환
      getNotificationsForSeller: (sellerId) => {
        return get().notifications.filter(
          (n) => n.sellerId === sellerId && n.type === 'order'
        );
      },

      // 특정 유저(구매자)의 픽업 알림 반환 (전/후 모두)
      getNotificationsForUser: (userId) => {
        return get().notifications.filter(
          (n) =>
            n.userId === userId &&
            (n.type === 'pickup' || n.type === 'pickup-done')
        );
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

      // 특정 유저의 픽업 알림 모두 읽음 처리 (전/후 모두)
      markAllAsReadForUser: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId &&
            (n.type === 'pickup' || n.type === 'pickup-done')
              ? { ...n, isRead: true }
              : n
          ),
        }));
      },

      // 판매자의 읽지 않은 알림 수
      unreadCountForSeller: (sellerId) => {
        return get().notifications.filter(
          (n) =>
            n.sellerId === sellerId &&
            n.type === 'order' &&
            !n.isRead
        ).length;
      },

      // 유저의 읽지 않은 픽업 알림 수 (전/후 모두)
      unreadCountForUser: (userId) => {
        return get().notifications.filter(
          (n) =>
            n.userId === userId &&
            (n.type === 'pickup' || n.type === 'pickup-done') &&
            !n.isRead
        ).length;
      },
    }),
    {
      name: 'notification-storage',
      version: 1,
      migrate: (persistedState: unknown) => {
        const state = persistedState as { notifications: Notification[] };
        return {
          ...state,
          notifications: (state.notifications || []).map((n) => ({
            ...n,
            type: n.type || 'order',
            userId: n.userId ?? 0,
          })),
        };
      },
    }
  )
);

export default useNotificationStore;
