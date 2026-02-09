'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPurchaseDetail } from '@/lib/purchase';
import type { PurchaseData } from '@/app/src/types';
import PurchasesDetailCard from '@/app/mypage/purchases/[id]/PurchasesDetailCard';
import GrayButton from '@/app/src/components/ui/GrayButton';
import { PurchaseDetailSkeleton } from '@/app/mypage/purchases/[id]/loading';

interface PurchaseDetailClientProps {
  orderId: string;
}

export default function PurchaseDetailClient({
  orderId,
}: PurchaseDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseDetail(orderId)
      .then(setOrder)
      .catch((e) => console.error('주문 상세 조회 실패', e))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <PurchaseDetailSkeleton />;
  }

  if (!order) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-600">주문 정보를 찾을 수 없습니다.</p>
      </section>
    );
  }

  const handlePickupComplete = () => {
    router.push(`/mypage/purchases/${orderId}/complete`);
  };

  return (
    <section className="flex-1 flex flex-col gap-5 pb-5">
      <PurchasesDetailCard order={order} />
      <GrayButton text="주문내역 조회" onClick={handlePickupComplete} />
    </section>
  );
}
