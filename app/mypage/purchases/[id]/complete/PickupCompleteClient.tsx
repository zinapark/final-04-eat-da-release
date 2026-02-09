'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPurchaseDetail } from '@/lib/purchase';
import type { PurchaseData, OrderStateCode } from '@/app/src/types';
import PurchasesDetailCard from '@/app/mypage/purchases/[id]/PurchasesDetailCard';
import GrayButton from '@/app/src/components/ui/GrayButton';
import Header from '@/app/src/components/common/Header';
import { PickupCompleteSkeleton } from '@/app/mypage/purchases/[id]/complete/loading';

const stateInfo: Record<OrderStateCode, { title: string; messages: string[] }> =
  {
    OS020: {
      title: '대기중',
      messages: ['주문을 확인중입니다.', '잠시만 기다려주세요!'],
    },
    OS040: {
      title: '주문 승인 완료',
      messages: [
        '주문이 승인되어 조리가 시작됩니다.',
        '약속된 픽업 시간에 맞춰 정성껏 준비해 드릴게요.',
      ],
    },
    OS060: {
      title: '반찬 준비 완료',
      messages: [
        '주문하신 반찬이 준비되었습니다.',
        '픽업 시간에 맞춰 주방으로 방문해 주세요.',
      ],
    },
    OS080: {
      title: '픽업 완료!',
      messages: ['오늘의 집밥을 잘 전달했어요.', '맛있게 드세요!'],
    },
    OS310: {
      title: '취소됨',
      messages: ['주문이 취소되었습니다.'],
    },
  };

interface PickupCompleteClientProps {
  orderId: string;
}

export default function PickupCompleteClient({
  orderId,
}: PickupCompleteClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseDetail(orderId)
      .then(setOrder)
      .catch((e) => console.error('주문 상세 조회 실패', e))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleReviewClick = () => {
    router.push('/review');
  };

  if (loading) {
    return (
      <>
        <Header title="" />
        <PickupCompleteSkeleton />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header title="" />
        <section className="px-5 mt-15 mb-24 flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <p className="text-gray-600">주문 정보를 찾을 수 없습니다.</p>
        </section>
      </>
    );
  }

  const info = stateInfo[order.state];

  return (
    <>
      <Header title={info.title} />
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        {/* 안내 문구 */}
        <div className="mt-2 text-paragraph text-gray-600">
          {info.messages.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>

        {/* 주문 상세 정보 */}
        <PurchasesDetailCard order={order} />
        {order.state === 'OS080' && (
          <GrayButton text="리뷰 쓰기" onClick={handleReviewClick} />
        )}
      </div>
    </>
  );
}
