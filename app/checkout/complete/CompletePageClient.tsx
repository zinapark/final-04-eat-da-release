'use client';

import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import OrderProductItem from '@/app/src/components/ui/OrderProductItem';
import { getAxios } from '@/lib/axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { OrderData } from '@/app/src/types';

dayjs.locale('ko');

export default function CompletePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const impUid = searchParams.get('imp_uid');
  const merchantUid = searchParams.get('merchant_uid');
  const impSuccess = searchParams.get('imp_success');

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePaymentComplete = async () => {
      const axios = getAxios();

      // 모바일 결제 리다이렉트 처리
      if (impUid && merchantUid && impSuccess === 'true' && !orderId) {
        try {
          // 결제 성공 - 주문 생성
          // localStorage에서 주문 정보 가져오기
          const pendingOrderStr = localStorage.getItem('pendingOrder');

          if (!pendingOrderStr) {
            alert('주문 정보를 찾을 수 없습니다.');
            router.push('/');
            return;
          }

          const pendingOrder = JSON.parse(pendingOrderStr);

          // 서버에 주문 생성
          const orderData = {
            ...pendingOrder,
            extra: {
              ...pendingOrder.extra,
              imp_uid: impUid,
              merchant_uid: merchantUid,
            },
          };

          const orderResponse = await axios.post('/orders', orderData);

          // localStorage 정리
          localStorage.removeItem('pendingOrder');

          if (pendingOrder.isDirect) {
            localStorage.removeItem('directPurchase');
          } else {
            await axios.delete('/carts/cleanup');
          }

          // orderId로 리다이렉트
          router.replace(
            `/checkout/complete?orderId=${orderResponse.data.item._id}`
          );
          return;
        } catch (error) {
          console.error('주문 생성 실패:', error);
          alert('주문 생성에 실패했습니다.');
          router.push('/');
          return;
        }
      }

      // 모바일 결제 실패
      if (impSuccess === 'false') {
        alert('결제에 실패했습니다.');
        router.push('/checkout');
        return;
      }

      // orderId로 주문 조회
      if (orderId) {
        try {
          const response = await axios.get(`/orders/${orderId}`);
          setOrderData(response.data.item);
        } catch (error) {
          console.error('주문 조회 실패:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    handlePaymentComplete();
  }, [orderId, impUid, merchantUid, impSuccess, router]);

  const formatPickupTime = (timeRange: string) => {
    const timeMap: { [key: string]: string } = {
      '9-12': '9:00 - 12:00',
      '12-16': '12:00 - 16:00',
      '16-20': '16:00 - 20:00',
    };
    return timeMap[timeRange] || timeRange;
  };

  const formatPickupDate = (dateString: string) => {
    return dayjs(dateString).format('M월 D일 dddd');
  };

  const formatPreferredDay = (day: string) => {
    const dayMap: { [key: string]: string } = {
      monday: '월요일',
      tuesday: '화요일',
      wednesday: '수요일',
      thursday: '목요일',
      friday: '금요일',
    };
    return `매주 ${dayMap[day] || day}`;
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
                {(orderData.extra as any)?.isSubscription
                  ? (orderData.extra as any)?.pickupPlace
                  : orderData.products[0]?.extra?.pickupPlace}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-paragraph">픽업 날짜</p>
            <p className="text-paragraph font-semibold">
              {(orderData.extra as any)?.isSubscription
                ? formatPreferredDay((orderData.extra as any)?.preferredDay)
                : formatPickupDate(orderData.extra.pickupDate!)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-paragraph">픽업 시간</p>
            <p className="text-paragraph font-semibold">
              {formatPickupTime(
                (orderData.extra as any)?.isSubscription
                  ? (orderData.extra as any)?.preferredTime
                  : orderData.extra.pickupTime!
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <p className="text-paragraph font-semibold">
            {(orderData.extra as any)?.isSubscription ? '주간 결제 금액' : '총 결제 금액'}
          </p>
          <p className="text-paragraph font-semibold text-eatda-orange">
            {(orderData.extra as any)?.isSubscription
              ? `주당 ${orderData.cost.total.toLocaleString()}원`
              : `${orderData.cost.total.toLocaleString()}원`}
          </p>
        </div>
      </div>
      <BottomFixedButton as="link" href="/home">
        홈으로
      </BottomFixedButton>
    </>
  );
}
