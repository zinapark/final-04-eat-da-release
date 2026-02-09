'use client';

import { useEffect, useState } from 'react';
import { fetchPurchases } from '@/lib/purchase';
import type { PurchaseData } from '@/app/src/types';
import PurchaseCard from '@/app/mypage/purchases/PurchaseCard';
import Link from 'next/link';
import Image from 'next/image';
import { PurchasesSkeleton } from '@/app/mypage/purchases/loading';

export default function PurchasesClient() {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases()
      .then(setPurchases)
      .catch((e) => console.error('구매 내역 조회 실패', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PurchasesSkeleton />;
  }

  return (
    <section className="px-5 mt-15 mb-24 flex flex-1 flex-col min-h-[calc(100vh-10rem)]">
      {purchases.length ? (
        purchases.map((order) => {
          const date = new Date(order.createdAt).toLocaleDateString('ko-KR');
          return (
            <div key={order._id}>
              {/* 날짜 + 주문상세 */}
              <div className="py-4 flex justify-between border-b-[0.5px] border-gray-600">
                <p className="font-semibold text-gray-800 text-display-2">
                  {date}
                </p>
                <Link
                  href={`/mypage/purchases/${order._id}`}
                  className="flex items-center gap-3"
                >
                  <p className="text-display-2 text-gray-800">주문상세</p>
                  <Image
                    src="/ArrowRight.svg"
                    alt="주문상세 이동하기"
                    width={5}
                    height={10}
                  />
                </Link>
              </div>

              {/* 주문별 상품 */}
              <div className="flex flex-col gap-4 py-5">
                {order.products.map((product) => (
                  <PurchaseCard
                    key={product._id}
                    product={product}
                    quantity={product.quantity}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-1 flex-col gap-6 items-center justify-center">
          <div className="text-center gap-2 text-gray-600">
            <p>구매 내역이 없습니다.</p>
            <p>오늘의 식탁을 채워줄 동네 반찬을 만나보세요.</p>
          </div>
          <Link href="/products">
            <button className="px-5 py-3 bg-gray-200 border border-gray-300 text-display-1 rounded-lg">
              반찬 둘러보기
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}
