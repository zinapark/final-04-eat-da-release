"use client";

import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import OrderProductItem from "@/app/src/components/ui/OrderProductItem";
import { getAxios } from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { OrderData } from "@/app/src/types";

dayjs.locale("ko");

export default function CompletePageClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const axios = getAxios();
          const response = await axios.get(`/orders/${orderId}`);
          setOrderData(response.data.item);
        } catch (error) {
          console.error("주문 조회 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const formatPickupTime = (timeRange: string) => {
    const timeMap: { [key: string]: string } = {
      "9-12": "9:00 - 12:00",
      "12-16": "12:00 - 16:00",
      "16-20": "16:00 - 20:00",
    };
    return timeMap[timeRange] || timeRange;
  };

  const formatPickupDate = (dateString: string) => {
    return dayjs(dateString).format("M월 D일 dddd");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">주문 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-5 space-y-5 mt-5 mb-16">
        <div className="space-y-5">
          <h2 className="text-display-6 font-semibold">결제 완료!</h2>
          <div>
            <p className="text-paragraph text-gray-600">주문이 접수되었어요.</p>
            <p className="text-paragraph text-gray-600">
              픽업 정보를 확인하고, 동네 집밥을 만나러 가보세요.
            </p>
          </div>
        </div>

        <div className="flex justify-between py-3 border-b-[0.5px] border-gray-600">
          <p className="text-paragraph font-semibold">주문번호</p>
          <p className="text-paragraph font-semibold">
            ORDER - {orderData._id}
          </p>
        </div>

        <div className="space-y-3">
          {orderData.products.map((product) => (
            <OrderProductItem
              key={product._id}
              imageSrc={product.image.path}
              dishName={product.name}
              chefName={product.seller.name}
              price={product.price}
            />
          ))}
        </div>

        <div className="space-y-2.5 border-b-[0.5px] border-gray-600 pb-5">
          <div className="flex justify-between">
            <p className="text-paragraph">픽업 장소</p>
            <div className="flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
              >
                <path
                  d="M11.7241 5.86207C11.7241 9.61379 5.86207 13.6 5.86207 13.6C5.86207 13.6 0 9.61379 0 5.86207C0 2.57931 2.75404 0 5.86207 0C8.97009 0 11.7241 2.57931 11.7241 5.86207Z"
                  fill="#FF6155"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.86213 4.45475C5.08513 4.45475 4.45524 5.08464 4.45524 5.86164C4.45524 6.63865 5.08513 7.26854 5.86213 7.26854C6.63914 7.26854 7.26903 6.63865 7.26903 5.86164C7.26903 5.08464 6.63914 4.45475 5.86213 4.45475ZM3.04834 5.86164C3.04834 4.30763 4.30812 3.04785 5.86213 3.04785C7.41615 3.04785 8.67593 4.30763 8.67593 5.86164C8.67593 7.41566 7.41615 8.67544 5.86213 8.67544C4.30812 8.67544 3.04834 7.41566 3.04834 5.86164Z"
                  fill="white"
                />
              </svg>
              <p className="text-paragraph font-semibold">
                {orderData.products[0]?.extra?.pickupPlace}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-paragraph">픽업 날짜</p>
            <p className="text-paragraph font-semibold">
              {formatPickupDate(orderData.extra.pickupDate)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-paragraph">픽업 시간</p>
            <p className="text-paragraph font-semibold">
              {formatPickupTime(orderData.extra.pickupTime)}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <p className="text-paragraph font-semibold">총 결제 금액</p>
          <p className="text-paragraph font-semibold text-eatda-orange">
            {orderData.cost.total.toLocaleString()}원
          </p>
        </div>
      </div>
      <BottomFixedButton as="link" href="/home">
        홈으로
      </BottomFixedButton>
    </>
  );
}
