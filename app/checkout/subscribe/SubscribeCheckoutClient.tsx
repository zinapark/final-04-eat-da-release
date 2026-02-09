'use client';

import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import Header from '@/app/src/components/common/Header';
import PurchaseProductItem from '@/app/src/components/ui/PurchaseProductItem';
import DayDropdown from '@/app/src/components/ui/DayDropdown';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import { Product } from '@/app/src/types';
import { getAxios } from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DirectPurchaseData {
  productId: number;
  quantity: number;
  totalAmount: number;
}

// 아임포트 타입 정의
declare global {
  interface Window {
    IMP: any;
  }
}

export default function SubscribeCheckoutClient() {
  const axios = getAxios();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [directQuantity, setDirectQuantity] = useState(0);
  const [directTotalAmount, setDirectTotalAmount] = useState(0);
  const [pickupPlace, setPickupPlace] = useState('공유주방');
  const [existingSubscriptionIds, setExistingSubscriptionIds] = useState<
    number[]
  >([]);
  const [existingSellerName, setExistingSellerName] = useState<string>('');
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = useSearchParams();
  const isDirect = searchParams.get('direct') === 'true';

  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);

    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isDirect) {
        const directPurchaseStr = localStorage.getItem('directPurchase');
        if (!directPurchaseStr) {
          console.log('상품 정보를 찾을 수 없습니다.');
          router.push('/');
          return;
        }

        const directPurchase: DirectPurchaseData =
          JSON.parse(directPurchaseStr);

        try {
          const response = await axios.get<{ item: Product }>(
            `/products/${directPurchase.productId}`
          );

          const product = response.data.item;
          setDirectProduct(product);
          setDirectQuantity(directPurchase.quantity);
          setDirectTotalAmount(directPurchase.totalAmount);

          // 구독 상품에 pickupPlace가 없으면 판매자의 일반 상품에서 가져오기
          if (product.extra?.pickupPlace) {
            setPickupPlace(product.extra.pickupPlace);
          } else if (product.seller?._id) {
            const sellerProductsRes = await axios.get<{ item: Product[] }>(
              `/products`,
              { params: { seller_id: product.seller._id } }
            );
            const regularProduct = sellerProductsRes.data.item?.find(
              (p) => !p.extra?.isSubscription && p.extra?.pickupPlace
            );
            if (regularProduct?.extra?.pickupPlace) {
              setPickupPlace(regularProduct.extra.pickupPlace);
            }
          }

          // 기존 구독 주문 확인
          const ordersRes = await axios.get('/orders');
          const orders = ordersRes.data.item || [];
          const existingSubscriptions = orders.filter(
            (order: any) =>
              order.extra?.isSubscription === true && order.state !== 'OS310'
          );

          if (existingSubscriptions.length > 0) {
            const existingOrderIds = existingSubscriptions.map(
              (order: any) => order._id
            );
            setExistingSubscriptionIds(existingOrderIds);

            // 기존 구독의 판매자 이름 가져오기
            const existingSeller =
              existingSubscriptions[0].products[0]?.seller?.name || '주부';
            setExistingSellerName(existingSeller);
          }
        } catch (error) {
          console.error('상품 정보 로드 실패:', error);
          alert('상품 정보를 불러올 수 없습니다.');
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };

    fetchData();
  }, [isDirect, router]);

  const handlePurchase = async () => {
    if (!selectedDay || !selectedTime) {
      alert('픽업 선호 요일과 시간을 선택해주세요.');
      return;
    }

    // 기존 구독이 있고, 다른 주부의 구독인 경우 확인 모달 표시
    if (
      existingSubscriptionIds.length > 0 &&
      existingSellerName !== directProduct?.seller?.name
    ) {
      setShowReplaceModal(true);
      return;
    }

    await processSubscription();
  };

  const processSubscription = async () => {
    if (isProcessing) {
      return;
    }

    if (!window.IMP) {
      alert('결제 모듈 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const merchantUid = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const productName = `${directProduct!.name} (구독)`;
      const IMP_CODE = process.env.NEXT_PUBLIC_IMP_CODE || 'imp10391932';

      const orderData = {
        products: [
          {
            _id: directProduct!._id,
            quantity: directQuantity,
          },
        ],
        extra: {
          isSubscription: true,
          preferredDay: selectedDay,
          preferredTime: selectedTime,
          pickupPlace: pickupPlace,
        },
        isDirect: true,
        existingSubscriptionIds: existingSubscriptionIds,
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      window.IMP.init(IMP_CODE);
      window.IMP.request_pay(
        {
          pg: 'html5_inicis.INIpayTest',
          pay_method: 'card',
          merchant_uid: merchantUid,
          name: productName,
          amount: directTotalAmount,
          buyer_name: '구매자',
          buyer_tel: '010-0000-0000',
          buyer_email: 'buyer@example.com',
          m_redirect_url: `${window.location.origin}/checkout/complete`,
          custom_data: {
            isSubscription: 'true',
            preferredDay: selectedDay,
            preferredTime: selectedTime,
            isDirect: 'true',
          },
        },
        async (rsp: any) => {
          if (rsp.success) {
            try {
              if (existingSubscriptionIds.length > 0) {
                await Promise.all(
                  existingSubscriptionIds.map((orderId) =>
                    axios.patch(`/orders/${orderId}`, {
                      state: 'OS310', // 주문 취소 상태
                    })
                  )
                );
              }

              const finalOrderData = {
                ...orderData,
                extra: {
                  ...orderData.extra,
                  imp_uid: rsp.imp_uid,
                  merchant_uid: rsp.merchant_uid,
                },
              };

              const orderResponse = await axios.post('/orders', finalOrderData);
              localStorage.removeItem('pendingOrder');
              localStorage.removeItem('directPurchase');

              router.push(
                `/checkout/complete?orderId=${orderResponse.data.item._id}`
              );
            } catch (error) {
              console.error('구독 주문 생성 실패:', error);
              alert('구독 주문 생성에 실패했습니다. 고객센터로 문의해주세요.');
              setIsProcessing(false);
            }
          } else {
            localStorage.removeItem('pendingOrder');
            alert(`결제에 실패했습니다: ${rsp.error_msg}`);
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error('구독 결제 처리 실패:', error);
      alert('구독 결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsProcessing(false);
    }
  };

  const handleReplaceConfirm = async () => {
    setShowReplaceModal(false);
    await processSubscription();
  };

  return (
    <>
      <Header title="구독권 결제" showBackButton={true} />

      <div className="p-5 space-y-5 mt-15 mb-16">
        <div>
          <button
            onClick={() => setIsProductInfoOpen(!isProductInfoOpen)}
            className={`w-full flex justify-between items-center ${!isProductInfoOpen ? 'pb-5 border-b-[0.5px] border-gray-600' : ''}`}
          >
            <p className="text-display-3 font-semibold">구독 상품 정보</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`transition-transform ${
                isProductInfoOpen ? 'rotate-180' : ''
              }`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#353E5C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isProductInfoOpen && (
            <div className="space-y-4 pt-3 pb-3">
              {directProduct && (
                <PurchaseProductItem
                  imageSrc={directProduct.mainImages?.[0]?.path || ''}
                  dishName={directProduct.name}
                  chefName={directProduct.seller?.name || ''}
                  price={directProduct.price}
                  quantity={directQuantity}
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-display-3 font-semibold">픽업 장소</p>
          <div className="flex gap-1 p-5 bg-gray-200 border border-gray-300 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M15.2104 8.24042C15.2104 12.3784 9.21045 16.7749 9.21045 16.7749C9.21045 16.7749 3.21045 12.3784 3.21045 8.24042C3.21045 4.61973 6.02929 1.7749 9.21045 1.7749C12.3916 1.7749 15.2104 4.61973 15.2104 8.24042Z"
                fill="#FF6155"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.21045 6.2749C8.38202 6.2749 7.71045 6.94648 7.71045 7.7749C7.71045 8.60333 8.38202 9.2749 9.21045 9.2749C10.0389 9.2749 10.7104 8.60333 10.7104 7.7749C10.7104 6.94648 10.0389 6.2749 9.21045 6.2749ZM6.21045 7.7749C6.21045 6.11805 7.55359 4.7749 9.21045 4.7749C10.8673 4.7749 12.2104 6.11805 12.2104 7.7749C12.2104 9.43176 10.8673 10.7749 9.21045 10.7749C7.55359 10.7749 6.21045 9.43176 6.21045 7.7749Z"
                fill="white"
              />
            </svg>
            <div>
              <p className="text-paragraph font-semibold">{pickupPlace}</p>
              <p className="text-paragraph-sm">서울시 마포구 동교로 15길</p>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 선호 날짜</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            매주 픽업을 희망하는 요일을 선택해주세요
          </p>
          <DayDropdown value={selectedDay} onChange={setSelectedDay} />
        </div>

        <div className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 선호 시간</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            매주 픽업을 희망하는 시간을 선택해주세요
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedTime('9-12')}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedTime === '9-12'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              9:00 - 12:00
            </button>
            <button
              onClick={() => setSelectedTime('12-16')}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedTime === '12-16'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              12:00 - 16:00
            </button>
            <button
              onClick={() => setSelectedTime('16-20')}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedTime === '16-20'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              16:00 - 20:00
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-display-3 font-semibold">결제 정보</h2>
          <div className="flex justify-between">
            <p className="text-paragraph">구독 금액 (주간)</p>
            <p className="text-paragraph text-gray-600">
              {(directTotalAmount ?? 0).toLocaleString()}원
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-paragraph">결제 주기</p>
            <p className="text-paragraph text-gray-600">매주 자동 결제</p>
          </div>
          <div className="flex justify-between border-t-[0.5px] border-gray-600 pt-4">
            <h2 className="text-paragraph-md font-semibold">주간 결제 금액</h2>
            <p className="text-paragraph text-gray-600">
              {(directTotalAmount ?? 0).toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="p-5 text-paragraph-sm bg-gray-200 border border-gray-300 rounded-lg">
          <p className="text-paragraph font-semibold mb-2">구독 안내사항</p>
          <p>• 선택하신 요일과 시간에 픽업 장소로 방문해주세요.</p>
          <p>• 매주 선택하신 요일에 자동으로 결제가 진행됩니다.</p>
          <p>• 구독 취소는 다음 결제일 2일 전까지 가능합니다.</p>
          <p>• 픽업 일정 변경은 해당 주 픽업일 2일 전까지 가능합니다.</p>
          <p>• 미수령 시 해당 주 반찬은 소멸되며 환불되지 않습니다.</p>
        </div>
      </div>

      <BottomFixedButton as="button" type="button" onClick={handlePurchase}>
        {isProcessing ? '결제 처리중...' : '구독권 결제하기'}
      </BottomFixedButton>

      {/* 기존 구독 대체 확인 모달 */}
      <ConfirmModal
        isOpen={showReplaceModal}
        title="이미 구독 중인 플랜이 있습니다"
        description={`현재 ${existingSellerName} 주부의 구독을 취소하고 새로운 구독으로 변경하시겠습니까?`}
        confirmText="구독 변경하기"
        onConfirm={handleReplaceConfirm}
        onCancel={() => setShowReplaceModal(false)}
      />
    </>
  );
}
