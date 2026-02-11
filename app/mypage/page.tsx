import MyPageClient from '@/app/mypage/MyPageClient';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import Header from '@/app/src/components/common/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지',
  description: '내 정보, 주문 내역, 리뷰 관리 등 나의 활동을 확인하세요.',
};

export default function MyPage() {
  return (
    <>
      <Header
        title={`${metadata.title}`}
        showSearch
        showNotification
        showCart
      />
      <MyPageClient />
      <BottomNavigation />
    </>
  );
}
