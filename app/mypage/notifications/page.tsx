import Header from '@/app/src/components/common/Header';
import NotificationsClient from './NotificationsClient';

export const metadata = {
  title: '알림 페이지',
  description: '주문 알림 확인',
};

export default function NotificationsPage() {
  return (
    <>
      <Header title="알림" showBackButton />
      <NotificationsClient />
    </>
  );
}
