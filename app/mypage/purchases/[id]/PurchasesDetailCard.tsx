'use client';

import type { PurchaseData } from '@/app/src/types';
import OrderProductItem from '@/app/src/components/ui/OrderProductItem';
import Image from 'next/image';
import { formatPickupTime } from '@/app/mypage/orders/OrdersClient';

interface PurchasesDetailCardProps {
  order: PurchaseData;
}

export default function PurchasesDetailCard({
  order,
}: PurchasesDetailCardProps) {
  return (
    <div className="flex flex-col gap-5 pb-5">
      {/* 주문번호 */}
      <div className="flex border-b-[0.5px] border-gray-600 py-3 justify-between items-center text-display-2 text-gray-800 font-semibold">
        <p>주문번호</p>
        <p>ORDER - {order._id}</p>
      </div>

      {/* 상품 정보 */}
      {order.products.map((product) => (
        <OrderProductItem
          key={product._id}
          imageSrc={product.image?.path}
          dishName={product.name}
          chefName={product.seller.name}
          price={product.price}
          quantity={product.quantity}
        />
      ))}

      {/* 픽업 장소 */}
      <div className="flex justify-between items-center">
        <p className="text-display-2 text-gray-800">픽업 장소</p>
        <div className="flex items-center gap-1">
          <Image src="/Location.svg" alt="주소" width={16} height={16} />
          <p className="text-display-2 font-semibold text-gray-800">
            {order.products[0]?.extra?.pickupPlace}
          </p>
        </div>
      </div>

      {/* 픽업 시간 */}
      <div className="flex justify-between items-center border-b-[0.5px] border-gray-600">
        <p className="text-display-2 text-gray-800 mb-5">픽업 시간</p>
        <p className="text-display-2 font-semibold text-gray-800">
          {/* 주문 관리 페이지에서 가져옴 */}
          {formatPickupTime(order.extra?.pickupTime)}
        </p>
      </div>

      {/* 총 결제 금액 */}
      <div className="flex justify-between items-center">
        <p className="text-display-2 font-semibold text-gray-800">
          총 결제 금액
        </p>
        <p className="text-display-2 font-semibold text-eatda-orange">
          {order.cost.total.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
