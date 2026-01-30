"use client";

import OrderProductItem from "@/app/src/components/ui/OrderProductItem";

// 주문 상세 데이터 타입
export interface OrderDetail {
  orderNumber: string;
  pickupLocation: string;
  pickupTime: string;
  totalPrice: number;
  product: {
    imageSrc: string;
    dishName: string;
    chefName: string;
    price: number;
  };
}

interface PurchasesDetailCardProps {
  order: OrderDetail;
}

export default function PurchasesDetailCard({
  order,
}: PurchasesDetailCardProps) {
  return (
    <div className="flex flex-col gap-5 pb-5">
      {/* 주문번호 */}
      <div className="flex border-b-[0.5px] border-gray-600 py-3 justify-between items-center text-display-2 text-gray-800 font-semibold">
        <p>주문번호</p>
        <p>ORDER - {order.orderNumber}</p>
      </div>

      {/* 상품 정보 */}
      <OrderProductItem
        imageSrc={order.product.imageSrc}
        dishName={order.product.dishName}
        chefName={order.product.chefName}
        price={order.product.price}
      />

      {/* 픽업 장소 */}
      <div className="flex justify-between items-center">
        <p className="text-display-2 text-gray-800">픽업 장소</p>
        <div className="flex items-center gap-1">
          <svg
            width="12"
            height="15"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 15 6 15C6 15 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 8.25C4.75736 8.25 3.75 7.24264 3.75 6C3.75 4.75736 4.75736 3.75 6 3.75C7.24264 3.75 8.25 4.75736 8.25 6C8.25 7.24264 7.24264 8.25 6 8.25Z"
              fill="#FF6B35"
            />
          </svg>
          <p className="text-display-2 font-semibold text-gray-800">
            {order.pickupLocation}
          </p>
        </div>
      </div>

      {/* 픽업 시간 */}
      <div className="flex justify-between items-center border-b-[0.5px] border-gray-600">
        <p className="text-display-2 text-gray-800 mb-5">픽업 시간</p>
        <p className="text-display-2 font-semibold text-gray-800">
          {order.pickupTime}
        </p>
      </div>

      {/* 총 결제 금액 */}
      <div className="flex justify-between items-center">
        <p className="text-display-2 font-semibold text-gray-800">
          총 결제 금액
        </p>
        <p className="text-display-2 font-semibold text-eatda-orange">
          {order.totalPrice.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
