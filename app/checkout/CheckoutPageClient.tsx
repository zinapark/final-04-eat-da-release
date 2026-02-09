'use client';

import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import Header from '@/app/src/components/common/Header';
import PurchaseProductItem from '@/app/src/components/ui/PurchaseProductItem';
import { CartItemType, CartResponse, Product } from '@/app/src/types';
import { getAxios } from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sendOrder } from '@/lib/socket/sendOrder';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

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

export default function CheckoutPageClient() {
  const axios = getAxios();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cost, setCost] = useState<CartResponse['cost'] | null>(null);
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [directQuantity, setDirectQuantity] = useState(0);
  const [directTotalAmount, setDirectTotalAmount] = useState(0);
  const [pickupPlace, setPickupPlace] = useState('공유주방');
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = useSearchParams();
  const isDirect = searchParams.get('direct') === 'true';

  const tomorrow = dayjs().add(1, 'day');
  const after_tomorrow = dayjs().add(2, 'day');

  // 아임포트 스크립트 로드
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

          setPickupPlace(product.extra?.pickupPlace || '공유주방');
        } catch (error) {
          console.error('상품 정보 로드 실패:', error);
          alert('상품 정보를 불러올 수 없습니다.');
          router.push('/');
        }
      } else {
        try {
          const response = await axios.get<CartResponse>('/carts');
          setCartItems(response.data.item || []);
          setCost(response.data.cost || { products: 0 });

          if (response.data.item && response.data.item.length > 0) {
            const firstProduct = response.data.item[0].product;
            setPickupPlace(firstProduct.extra?.pickupPlace || '공유주방');
          }
        } catch (error) {
          console.error('장바구니 정보 로드 실패:', error);
          alert(
            '장바구니 정보를 불러올 수 없습니다. 로그인이 필요할 수 있습니다.'
          );
          router.push('/login');
        }
      }
    };

    fetchData();
  }, [isDirect, router]);

  const handlePurchase = async () => {
    if (!selectedDate || !selectedTime) {
      alert('픽업 날짜와 시간을 선택해주세요.');
      return;
    }

    if (isProcessing) {
      return;
    }

    if (!window.IMP) {
      alert('결제 모듈 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const pickupDateValue =
        selectedDate === 'tomorrow'
          ? tomorrow.format('YYYY-MM-DD')
          : after_tomorrow.format('YYYY-MM-DD');

      // 결제 금액
      const totalAmount = isDirect ? directTotalAmount : (cost?.products ?? 0);

      // 주문 고유 ID 생성 (타임스탬프 + 랜덤)
      const merchantUid = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 상품명 생성
      const productName = isDirect
        ? directProduct!.name
        : cartItems.length > 1
          ? `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`
          : cartItems[0].product.name;

      // 아임포트 가맹점 식별코드
      const IMP_CODE = process.env.NEXT_PUBLIC_IMP_CODE || 'imp10391932';

      // 주문 데이터 준비 (모바일 결제 후 사용)
      const orderData = isDirect
        ? {
            products: [
              {
                _id: directProduct!._id,
                quantity: directQuantity,
              },
            ],
            extra: {
              pickupDate: pickupDateValue,
              pickupTime: selectedTime,
            },
            isDirect: true,
          }
        : {
            products: cartItems.map((item) => ({
              _id: item.product._id,
              quantity: item.quantity,
            })),
            extra: {
              pickupDate: pickupDateValue,
              pickupTime: selectedTime,
            },
            isDirect: false,
          };

      // 모바일 결제를 위해 주문 정보 임시 저장
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // 아임포트 초기화
      window.IMP.init(IMP_CODE);

      // 결제 요청
      window.IMP.request_pay(
        {
          pg: 'html5_inicis.INIpayTest', // PG사.상점아이디
          pay_method: 'card',
          merchant_uid: merchantUid,
          name: productName,
          amount: totalAmount,
          buyer_name: '구매자', // 실제 사용자 정보로 교체 필요
          buyer_tel: '010-0000-0000',
          buyer_email: 'buyer@example.com',
          m_redirect_url: `${window.location.origin}/checkout/complete`, // 모바일 결제 후 리다이렉트 URL
          custom_data: {
            pickupDate: pickupDateValue,
            pickupTime: selectedTime,
            isDirect: isDirect.toString(),
          },
        },
        async (rsp: any) => {
          if (rsp.success) {
            // 결제 성공 (PC/데스크톱)
            try {
              // 서버에 주문 생성
              const finalOrderData = {
                ...orderData,
                extra: {
                  ...orderData.extra,
                  imp_uid: rsp.imp_uid,
                  merchant_uid: rsp.merchant_uid,
                },
              };

              const orderResponse = await axios.post('/orders', finalOrderData);

              // localStorage 정리
              localStorage.removeItem('pendingOrder');

              if (isDirect) {
                localStorage.removeItem('directPurchase');
              } else {
                await axios.delete('/carts/cleanup');
              }

              // 판매자에게 주문 알림 전송
              try {
                if (isDirect && directProduct?.seller?._id) {
                  await sendOrder(directProduct.seller._id, [
                    { name: directProduct.name, quantity: directQuantity },
                  ]);
                } else {
                  // 판매자별로 제품 그룹화
                  const sellerProducts = new Map<number, { name: string; quantity: number }[]>();
                  for (const item of cartItems) {
                    const sellerId = item.product.seller._id;
                    if (!sellerId) continue;
                    const products = sellerProducts.get(sellerId) || [];
                    products.push({ name: item.product.name, quantity: item.quantity });
                    sellerProducts.set(sellerId, products);
                  }
                  // 판매자별로 순차 전송
                  for (const [sellerId, products] of sellerProducts) {
                    await sendOrder(sellerId, products);
                  }
                }
              } catch (e) {
                console.error('주문 알림 전송 실패:', e);
              }

              // 완료 페이지로 이동
              router.push(
                `/checkout/complete?orderId=${orderResponse.data.item._id}`
              );
            } catch (error) {
              console.error('주문 생성 실패:', error);
              alert('주문 생성에 실패했습니다. 고객센터로 문의해주세요.');
              setIsProcessing(false);
            }
          } else {
            // 결제 실패
            localStorage.removeItem('pendingOrder');
            alert(`결제에 실패했습니다: ${rsp.error_msg}`);
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header title="구매하기" showBackButton={true} />

      <div className="p-5 space-y-5 mt-15 mb-16">
        <div>
          <button
            onClick={() => setIsProductInfoOpen(!isProductInfoOpen)}
            className={`w-full flex justify-between items-center ${!isProductInfoOpen ? 'pb-5 border-b-[0.5px] border-gray-600' : ''}`}
          >
            <p className="text-display-3 font-semibold">구매 상품 정보</p>
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
              {isDirect
                ? directProduct && (
                    <PurchaseProductItem
                      imageSrc={directProduct.mainImages?.[0]?.path || ''}
                      dishName={directProduct.name}
                      chefName={directProduct.seller?.name || ''}
                      price={directProduct.price}
                      quantity={directQuantity}
                    />
                  )
                : cartItems.map((item) => (
                    <PurchaseProductItem
                      key={item._id}
                      imageSrc={item.product.image.path}
                      dishName={item.product.name}
                      chefName={item.product.seller.name}
                      price={item.product.price}
                      quantity={item.quantity}
                    />
                  ))}
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
          <h2 className="text-display-3 font-semibold">픽업 날짜</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            픽업할 날짜를 선택해주세요
          </p>
          <div className="flex gap-2.5 w-full">
            <button
              onClick={() => setSelectedDate('tomorrow')}
              className={`flex-1 py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedDate === 'tomorrow'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              <p className="text-paragraph font-semibold">내일</p>
              <p className="text-paragraph-sm">
                {tomorrow.format('M월 D일 dddd')}
              </p>
            </button>
            <button
              onClick={() => setSelectedDate('after_tomorrow')}
              className={`flex-1 py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedDate === 'after_tomorrow'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              <p className="text-paragraph font-semibold">모레</p>
              <p className="text-paragraph-sm">
                {after_tomorrow.format('M월 D일 dddd')}
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 시간</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            픽업할 시간을 선택해주세요
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
            <p className="text-paragraph">상품 금액</p>
            <p className="text-paragraph text-gray-600">
              {isDirect
                ? (directTotalAmount ?? 0).toLocaleString()
                : (cost?.products ?? 0).toLocaleString()}
              원
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-paragraph">수량</p>
            <p className="text-paragraph text-gray-600">
              {isDirect
                ? directQuantity
                : cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              개
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-paragraph">쿠폰</p>
            <p className="text-paragraph text-gray-600">사용안함</p>
          </div>
          <div className="flex justify-between border-t-[0.5px] border-gray-600 pt-4">
            <h2 className="text-paragraph-md font-semibold">총 결제 금액</h2>
            <p className="text-paragraph text-gray-600">
              {isDirect
                ? (directTotalAmount ?? 0).toLocaleString()
                : (cost?.products ?? 0).toLocaleString()}
              원
            </p>
          </div>
        </div>

        <div className="p-5 text-paragraph-sm bg-gray-200 border border-gray-300 rounded-lg">
          <p className="text-paragraph font-semibold mb-2">안내사항</p>
          <p>• 선택하신 시간에 픽업 장소로 방문해주세요.</p>
          <p>• 픽업 시간이 지나면 자동으로 취소될 수 있습니다.</p>
          <p>• 결제 후 변경 및 취소는 픽업 2시간 전까지 가능합니다.</p>
          <p>• 음식은 위생적으로 포장되어 준비됩니다.</p>
          <p>
            • 본 상품은 주문 후 조리되는 반찬으로, 미수령 시 30%의 수수료가
            발생합니다.
          </p>
        </div>
      </div>

      <BottomFixedButton as="button" type="button" onClick={handlePurchase}>
        {isProcessing ? '결제 처리중...' : '구매하기'}
      </BottomFixedButton>
    </>
  );
}
