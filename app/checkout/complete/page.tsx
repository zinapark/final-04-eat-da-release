import CompletePageClient from '@/app/checkout/complete/CompletePageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '주문완료 - 잇다',
  description: '주문이 완료되었습니다! 맛있는 반찬을 기다려주세요!',
};

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <CompletePageClient />
    </Suspense>
  );
}
