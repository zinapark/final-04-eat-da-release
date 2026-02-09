import { Metadata } from 'next';
import { Suspense } from 'react';
import SubscribeCheckoutClient from './SubscribeCheckoutClient';

export const metadata: Metadata = {
  title: '구독권 결제',
  description: '구독 상품 구매 페이지',
};

export default function SubscribeCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-5 mt-15">로딩 중...</div>}>
      <SubscribeCheckoutClient />
    </Suspense>
  );
}
