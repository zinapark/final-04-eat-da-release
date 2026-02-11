import { Metadata } from 'next';
import CheckoutPageClient from './CheckoutPageClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '주문하기 - 잇다',
  description: '픽업 정보를 입력하고 안전하게 결제하세요.',
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <CheckoutPageClient />
    </Suspense>
  );
}
