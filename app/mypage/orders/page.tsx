import OrdersClient from '@/app/mypage/orders/OrdersClient';
import Header from '@/app/src/components/common/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주문 관리',
  openGraph: {
    title: '잇다 주문관리 목록',
    description: '주문관리 페이지',
    url: '/mypage/orders',
  },
};

export default function OrdersPage() {
  return (
    <>
      <Header
        title={`${metadata.title}`}
        showBackButton={true}
        showSearch={true}
        showCart={true}
      />
      <OrdersClient />
    </>
  );
}
