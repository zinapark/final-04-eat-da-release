'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Toast from '@/app/src/components/ui/Toast';
import { useSellerSocket } from '@/lib/socket/useSellerSocket';
import useUserStore from '@/zustand/userStore';
import useNotificationStore from '@/zustand/notificationStore';

const HIDDEN_PATHS = ['/login', '/signup', '/mypage/verify'];

export default function GlobalToastProvider() {
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  // 판매자일 때만 소켓 알림 수신
  const { toasts, removeToast } = useSellerSocket(
    user?.type === 'seller' ? user._id : 0
  );

  // 구매자 픽업 알림 토스트 표시
  const allNotifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const pickupToasts = useMemo(() => {
    if (!user) return [];
    return allNotifications
      .filter(
        (n) =>
          (n.type === 'pickup' || n.type === 'pickup-done') &&
          n.userId === user._id &&
          !n.isRead
      )
      .map((n) => ({
        id: n.id,
        message: n.text,
        type: n.type as 'pickup' | 'pickup-done',
      }))
      .sort((a, b) => {
        const timeA = parseInt(a.id.split('-')[0]);
        const timeB = parseInt(b.id.split('-')[0]);
        return timeB - timeA;
      });
  }, [allNotifications, user]);

  if (!user || HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <div className="fixed top-0 right-5 w-105 z-60 pointer-events-none pt-5 flex flex-col items-end gap-3 max-[743px]:inset-x-0 max-[743px]:w-auto max-[743px]:max-w-186 max-[743px]:mx-auto max-[743px]:px-5 max-[468px]:items-center">
      {[...toasts].reverse().map((toast, i) => (
        <Toast
          key={i}
          items={toast.items}
          onClose={() => removeToast(toasts.length - 1 - i)}
        />
      ))}

      {pickupToasts.map((toast) => (
        <Toast
          variant={toast.type}
          key={toast.id}
          message={toast.message}
          onClose={() => markAsRead(toast.id)}
        />
      ))}
    </div>
  );
}
