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

  useEffect(() => {
    if (!loggedInUser) {
      router.replace('/login?redirect=/mypage/notifications');
    }
  }, [loggedInUser, router]);

  // 현재 판매자의 알림만 필터링 (allNotifications 변경 시 자동 업데이트)
  const notifications = useMemo(() => {
    if (!loggedInUser) return [];
    return allNotifications.filter((n) => n.sellerId === loggedInUser._id);
  }, [allNotifications, loggedInUser]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  if (!loggedInUser) {
    return null;
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    // 주문 관리 페이지로 이동
    router.push('/mypage/orders');
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
              onClick={() => markAllAsRead(loggedInUser._id)}
              className="text-display-1 text-eatda-orange hover:underline"
            >
              모두 읽음
            </button>
          )}
        </div>

        {/* 알림 목록 */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="mt-4 text-display-2">아직 알림이 없어요</p>
            <p className="mt-1 text-display-1">
              새 주문이 들어오면 여기에 표시돼요
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
                      src="/OrderBag.svg"
                      alt="주문"
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* 알림 내용 */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-paragraph ${!notification.isRead ? 'font-semibold' : ''}`}
                    >
                      새 주문이 들어왔습니다.
                    </p>
                    {/* 제품 목록 표시 */}
                    {notification.text.startsWith('새 주문: ') && (
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
