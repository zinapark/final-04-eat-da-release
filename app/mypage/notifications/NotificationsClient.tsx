'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useNotificationStore, {
  Notification,
} from '@/zustand/notificationStore';
import useUserStore from '@/zustand/userStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function NotificationsClient() {
  const router = useRouter();
  const loggedInUser = useUserStore((state) => state.user);

  // notifications 배열을 직접 구독해야 상태 변경 시 리렌더링됨
  const allNotifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const markAllAsReadForUser = useNotificationStore(
    (state) => state.markAllAsReadForUser
  );

  useEffect(() => {
    if (!loggedInUser) {
      router.replace('/login?redirect=/mypage/notifications');
    }
  }, [loggedInUser, router]);

  // 판매자 주문 알림 + 구매자 픽업 알림 모두 표시
  const notifications = useMemo(() => {
    if (!loggedInUser) return [];
    return allNotifications
      .filter(
        (n) =>
          (n.type === 'order' && n.sellerId === loggedInUser._id) ||
          ((n.type === 'pickup' || n.type === 'pickup-done') &&
            n.userId === loggedInUser._id)
      )
      .sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
  }, [allNotifications, loggedInUser]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  if (!loggedInUser) {
    return null;
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.type === 'pickup' || notification.type === 'pickup-done') {
      router.push(`/mypage/purchases/${notification.orderId}`);
    } else {
      router.push('/mypage/orders');
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(loggedInUser._id);
    markAllAsReadForUser(loggedInUser._id);
  };

  const formatTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  return (
    <>
      <div className="mt-15 mb-24 min-h-[calc(100vh-10rem)]">
        {/* 상단 액션 바 */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-400">
          <p className="text-display-2 text-gray-600">
            {unreadCount > 0
              ? `읽지 않은 알림 ${unreadCount}개`
              : '모든 알림을 확인했어요'}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-display-1 text-eatda-orange hover:underline"
            >
              모두 읽음
            </button>
          )}
        </div>

        {/* 알림 목록 */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 min-h-[calc(100vh-10rem)]">
            <p className="text-display-3">아직 알림이 없어요</p>
            <p className="mt-4 text-display-2">
              새 주문이나 픽업 알림이 여기에 표시돼요
            </p>
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`border-b border-gray-300 ${
                  !notification.isRead ? 'bg-orange-50' : 'bg-white'
                }`}
              >
                <div
                  onClick={() => handleNotificationClick(notification)}
                  className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-100"
                >
                  {/* 알림 아이콘 */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      !notification.isRead ? 'bg-eatda-orange' : 'bg-gray-400'
                    }`}
                  >
                    <Image
                      src={
                        notification.type === 'pickup' ||
                        notification.type === 'pickup-done'
                          ? '/NotificationWhite.svg'
                          : '/OrderBag.svg'
                      }
                      alt={
                        notification.type === 'pickup' ||
                        notification.type === 'pickup-done'
                          ? '픽업 알림'
                          : '주문'
                      }
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* 알림 내용 */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-paragraph ${!notification.isRead ? 'font-semibold' : ''}`}
                    >
                      {notification.type === 'pickup'
                        ? '픽업 리마인더'
                        : notification.type === 'pickup-done'
                          ? '픽업 알림'
                          : '새 주문이 들어왔습니다.'}
                    </p>
                    {notification.type === 'pickup' ||
                    notification.type === 'pickup-done' ? (
                      <div className="text-display-1 text-gray-600 mt-1">
                        {notification.text.split('\n').map((line, idx) => (
                          <p key={idx}>
                            {line.replace(
                              /(\d{1,2})-(\d{1,2})(?!시)/,
                              '$1시-$2시'
                            )}
                          </p>
                        ))}
                      </div>
                    ) : (
                      notification.text.startsWith('새 주문: ') && (
                        <div className="mt-1">
                          {notification.text
                            .replace('새 주문: ', '')
                            .split(', ')
                            .map((item, idx) => (
                              <p
                                key={idx}
                                className="text-display-1 text-gray-600"
                              >
                                {item}
                              </p>
                            ))}
                        </div>
                      )
                    )}
                    <p className="text-display-1 text-gray-500 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
