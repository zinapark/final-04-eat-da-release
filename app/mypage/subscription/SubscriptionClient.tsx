'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import GrayButton from '@/app/src/components/ui/GrayButton';
import SubscriptionCard from '@/app/mypage/subscription/SubscriptionCard';
import DayDropdown from '@/app/src/components/ui/DayDropdown';
import { getAxios } from '@/lib/axios';
import { SubscriptionSkeleton } from '@/app/mypage/subscription/loading';
import { getTier } from '@/lib/tier';
import { Product } from '@/app/src/types';

interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  frequency: string;
  portions: string;
  price: number;
}

interface SellerInfo {
  _id: number;
  name: string;
  profileImage: string;
  description: string;
  tier: string;
  rating: number;
  reviewCount: number;
}

interface SubscriptionOrder {
  _id: number;
  products: {
    _id: number;
    name: string;
    price: number;
    seller_id: number;
    seller: { _id: number; name: string };
  }[];
  extra: {
    isSubscription?: boolean;
    preferredDay?: string;
    preferredTime?: string;
  };
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'light',
    title: '가볍게 잇는 집밥',
    description: '주 2~3회만 집밥을 먹는 분에게 추천!',
    frequency: '주 1회',
    portions: '픽업당 반찬 3종',
    price: 15000,
  },
  {
    id: 'standard',
    title: '생활에 자리 잡은 집밥',
    description: '평일 저녁을 자주 집에서 먹는 분에게 추천!',
    frequency: '주 2회',
    portions: '픽업당 반찬 3~4종',
    price: 28000,
  },
  {
    id: 'full',
    title: '식탁을 맡기는 집밥',
    description: '거의 매일 집밥을 먹는 자취생에게 추천!',
    frequency: '주 3회',
    portions: '픽업당 반찬 4종',
    price: 39000,
  },
];

export default function SubscriptionClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentPreferredDay, setCurrentPreferredDay] = useState<string>('');
  const [currentPreferredTime, setCurrentPreferredTime] = useState<string>('');
  const [currentPickupPlace, setCurrentPickupPlace] = useState<string>('');
  const [originalPreferredDay, setOriginalPreferredDay] = useState<string>('');
  const [originalPreferredTime, setOriginalPreferredTime] =
    useState<string>('');
  const [subscriptionOrderIds, setSubscriptionOrderIds] = useState<number[]>(
    []
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelCompleteModal, setShowCancelCompleteModal] = useState(false);
  const [showChangeCompleteModal, setShowChangeCompleteModal] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const axios = getAxios();

      // 사용자의 주문 목록 조회
      const ordersRes = await axios.get('/orders');
      const orders = ordersRes.data.item || [];

      // 구독 주문만 필터링 (취소되지 않은 것만)
      const subscriptionOrders = orders.filter(
        (order: any) =>
          order.extra?.isSubscription === true && order.state !== 'OS310'
      );

      if (subscriptionOrders.length === 0) {
        setHasSubscription(false);
        setIsLoading(false);
        return;
      }

      // 가장 최근 구독 주문
      const latestOrder = subscriptionOrders[0];
      setHasSubscription(true);

      // 모든 구독 주문 ID 저장 (취소 시 사용)
      const orderIds = subscriptionOrders.map((order: any) => order._id);
      setSubscriptionOrderIds(orderIds);

      // 현재 구독 플랜 찾기 (가격으로 매칭)
      const productPrice = latestOrder.products[0]?.price;
      const matchedPlan = subscriptionPlans.find(
        (p) => p.price === productPrice
      );
      if (matchedPlan) {
        setSelectedPlan(matchedPlan.id);
        setCurrentPlanId(matchedPlan.id);
      }

      // 현재 구독의 선호 요일/시간/픽업 장소 저장
      if (latestOrder.extra?.preferredDay) {
        setCurrentPreferredDay(latestOrder.extra.preferredDay);
        setOriginalPreferredDay(latestOrder.extra.preferredDay);
      }
      if (latestOrder.extra?.preferredTime) {
        setCurrentPreferredTime(latestOrder.extra.preferredTime);
        setOriginalPreferredTime(latestOrder.extra.preferredTime);
      }
      if (latestOrder.extra?.pickupPlace) {
        setCurrentPickupPlace(latestOrder.extra.pickupPlace);
      }

      // 판매자 정보 조회
      const sellerId =
        latestOrder.products[0]?.seller_id ||
        latestOrder.products[0]?.seller?._id;
      if (sellerId) {
        await fetchSellerInfo(sellerId);
      }
    } catch (error) {
      console.error('구독 정보 조회 실패:', error);
      setHasSubscription(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerInfo = async (sellerId: number) => {
    try {
      const axios = getAxios();

      const [sellerRes, usersRes, productsRes] = await Promise.all([
        axios.get(`/users/${sellerId}`),
        axios.get('/users/'),
        axios.get('/products', { params: { seller_id: sellerId } }),
      ]);

      const seller = sellerRes.data.item;
      const users = usersRes.data.item || [];
      const products: Product[] = productsRes.data.item || [];

      // 판매자 목록에서 totalSales 찾기
      const sellerFromList = users.find(
        (u: any) => u._id === sellerId || u.seller_id === sellerId
      );
      const totalSales = sellerFromList?.totalSales ?? 0;
      const tier = getTier(totalSales);

      // 일반 상품들로 평점과 리뷰 수 계산
      const regularProducts = products.filter((p) => !p.extra?.isSubscription);
      const totalRating =
        regularProducts.length > 0
          ? regularProducts.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
            regularProducts.length
          : 0;
      const totalReviewCount = regularProducts.reduce(
        (sum, p) =>
          sum +
          (Array.isArray(p.replies) ? p.replies.length : (p.replies ?? 0)),
        0
      );

      setSellerInfo({
        _id: sellerId,
        name: seller?.name ?? '주부',
        profileImage:
          seller?.extra?.profileImage ?? seller?.image ?? '/seller/seller1.png',
        description:
          seller?.extra?.description ??
          seller?.extra?.intro ??
          '정성스럽게 만든 집밥을 나눕니다.',
        tier: tier.label,
        rating: totalRating,
        reviewCount: totalReviewCount,
      });
    } catch (error) {
      console.error('판매자 정보 조회 실패:', error);
    }
  };

  const handlePlanClick = (planId: string) => {
    setSelectedPlan(selectedPlan === planId ? null : planId);
  };

  const handleChangePlan = async () => {
    const isPlanDifferent = selectedPlan && selectedPlan !== currentPlanId;
    const isScheduleDifferent =
      currentPreferredDay !== originalPreferredDay ||
      currentPreferredTime !== originalPreferredTime;

    if (!sellerInfo || (!isPlanDifferent && !isScheduleDifferent)) {
      return;
    }

    try {
      const axios = getAxios();

      // 사용할 플랜 결정 (변경된 플랜 또는 현재 플랜)
      const targetPlanId = isPlanDifferent ? selectedPlan : currentPlanId;
      const targetPlan = subscriptionPlans.find((p) => p.id === targetPlanId);
      if (!targetPlan) return;

      // 판매자의 구독 상품 목록 조회
      const productsRes = await axios.get('/products', {
        params: { seller_id: sellerInfo._id },
      });
      const products: Product[] = productsRes.data.item || [];

      // 구독 상품 중 선택한 플랜 가격과 일치하는 상품 찾기
      const subscriptionProducts = products.filter(
        (p) => p.extra?.isSubscription === true
      );
      const matchingProduct = subscriptionProducts.find(
        (p) => p.price === targetPlan.price
      );

      if (!matchingProduct) {
        alert('해당 플랜의 상품을 찾을 수 없습니다.');
        return;
      }

      // 기존 구독 주문들 취소 처리
      if (subscriptionOrderIds.length > 0) {
        await Promise.all(
          subscriptionOrderIds.map((orderId) =>
            axios.patch(`/orders/${orderId}`, {
              state: 'OS310', // 주문 취소 상태
            })
          )
        );
      }

      // 새 구독 주문 생성
      const orderData = {
        products: [
          {
            _id: matchingProduct._id,
            quantity: 1,
          },
        ],
        extra: {
          isSubscription: true,
          preferredDay: currentPreferredDay,
          preferredTime: currentPreferredTime,
          pickupPlace: currentPickupPlace,
        },
      };

      await axios.post('/orders', orderData);

      // 구독 데이터 새로고침
      if (isPlanDifferent) {
        setCurrentPlanId(selectedPlan);
      }
      setShowChangeCompleteModal(true);

      // 데이터 새로고침
      await fetchSubscriptionData();
    } catch (error) {
      console.error('구독 정보 변경 실패:', error);
      alert('구독 정보 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);

    try {
      const axios = getAxios();

      // 모든 구독 주문 취소 처리 (state를 취소 상태로 변경)
      await Promise.all(
        subscriptionOrderIds.map((orderId) =>
          axios.patch(`/orders/${orderId}`, {
            state: 'OS310', // 주문 취소 상태
          })
        )
      );

      setShowCancelCompleteModal(true);
    } catch (error) {
      console.error('구독 취소 실패:', error);
      alert('구독 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancelCompleteConfirm = () => {
    setShowCancelCompleteModal(false);
    setHasSubscription(false);
    router.push('/mypage');
  };

  const handleChangeCompleteConfirm = () => {
    setShowChangeCompleteModal(false);
    router.push('/mypage');
  };

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  if (!hasSubscription) {
    return (
      <div className="px-5 mt-15 mb-24 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-display-3 text-gray-600 mb-4">
          구독 중인 상품이 없습니다.
        </p>
        <p className="text-paragraph text-gray-500 mb-8">
          주부의 반찬을 구독해보세요!
        </p>
        <button
          onClick={() => router.push('/sellers')}
          className="px-6 py-3 bg-eatda-orange text-white rounded-lg font-semibold"
        >
          주부 둘러보기
        </button>
      </div>
    );
  }

  const isPlanChanged = selectedPlan && selectedPlan !== currentPlanId;
  const isScheduleChanged =
    currentPreferredDay !== originalPreferredDay ||
    currentPreferredTime !== originalPreferredTime;
  const hasChanges = isPlanChanged || isScheduleChanged;

  return (
    <>
      <div className="px-5 mt-15 mb-40 flex flex-1 flex-col gap-5">
        {/* 설명 */}
        <p className="text-display-2 text-gray-600">
          현재 구독 중인 플랜 정보를 확인하세요.
        </p>

        {/* 주부 소개글 */}
        {sellerInfo && (
          <article className="flex items-start gap-2.5 self-stretch pt-3">
            <img
              src={sellerInfo.profileImage}
              alt={`${sellerInfo.name} 주부 프로필 이미지`}
              className="h-15 w-15 flex-none rounded-full object-cover"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <header className="flex flex-col gap-0">
                <h3 className="text-paragraph-lg font-semibold text-gray-800">
                  {sellerInfo.name} {sellerInfo.tier}
                </h3>

                <div className="flex items-center gap-1 text-paragraph font-regular text-gray-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6 4.8282C12.5938 4.97659 12.5153 5.14606 12.3631 5.27989C11.7537 5.81524 11.144 6.35008 10.5339 6.88442C10.249 7.13435 9.96381 7.3839 9.67818 7.63306C9.63736 7.66853 9.62699 7.69998 9.63953 7.75502C9.8588 8.71317 10.0763 9.67171 10.292 10.6306C10.3356 10.8234 10.3786 11.0164 10.4258 11.2085C10.4946 11.4929 10.4067 11.7739 10.1851 11.933C9.94117 12.108 9.68219 12.1194 9.42439 11.9665C8.6032 11.4783 7.78307 10.9882 6.96399 10.4961C6.77277 10.3819 6.57921 10.2703 6.39117 10.1518C6.32827 10.1122 6.2826 10.1119 6.21803 10.1507C5.22195 10.7486 4.22371 11.3428 3.22881 11.9406C3.01751 12.0674 2.8017 12.115 2.56816 12.0192C2.25917 11.8924 2.09773 11.5675 2.17452 11.2299C2.39166 10.2743 2.60915 9.31872 2.82696 8.36313C2.8728 8.16238 2.91379 7.96012 2.96348 7.76087C2.97786 7.70332 2.96783 7.66936 2.92416 7.63139C2.54987 7.30583 2.17652 6.97916 1.80412 6.65137C1.28233 6.19332 0.758534 5.73845 0.239753 5.27705C0.0279584 5.08901 -0.052343 4.84894 0.0344829 4.57441C0.121309 4.29988 0.31537 4.1346 0.60479 4.10482C1.11772 4.05229 1.63148 4.00829 2.1449 3.96128C2.65281 3.91477 3.16072 3.8686 3.66862 3.82276C3.83792 3.80753 4.00723 3.79047 4.1767 3.77759C4.23123 3.77357 4.26034 3.74965 4.28075 3.69996C4.74081 2.61891 5.20165 1.53829 5.66328 0.45813C5.79075 0.159509 6.01844 -0.00728399 6.30786 0.000244267C6.59728 0.00777252 6.80607 0.149136 6.92083 0.414968C7.23317 1.13818 7.54149 1.86307 7.85115 2.58762C8.00875 2.95567 8.16667 3.32472 8.32159 3.69444C8.34534 3.75132 8.3793 3.77341 8.43869 3.77809C8.84689 3.81266 9.25498 3.84891 9.66295 3.88683C10.257 3.94081 10.8509 3.99524 11.4448 4.05011C11.6335 4.06684 11.8224 4.08357 12.0106 4.10465C12.3529 4.14513 12.6027 4.43071 12.6 4.8282Z"
                      fill="#FF6155"
                    />
                  </svg>
                  <span className="text-eatda-orange">
                    {sellerInfo.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-x-small">
                    ({sellerInfo.reviewCount})
                  </span>
                </div>
              </header>

              <p className="text-paragraph font-regular text-gray-600">
                {sellerInfo.description}
              </p>
            </div>
          </article>
        )}

        {/* 픽업 선호 날짜 */}
        <section className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 선호 날짜</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            매주 픽업을 희망하는 요일을 선택해주세요
          </p>
          <DayDropdown
            value={currentPreferredDay}
            onChange={setCurrentPreferredDay}
          />
        </section>

        {/* 픽업 선호 시간 */}
        <section className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 선호 시간</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            매주 픽업을 희망하는 시간을 선택해주세요
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setCurrentPreferredTime('9-12')}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                currentPreferredTime === '9-12'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              9:00 - 12:00
            </button>
            <button
              type="button"
              onClick={() => setCurrentPreferredTime('12-16')}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                currentPreferredTime === '12-16'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              12:00 - 16:00
            </button>
            <button
              type="button"
              onClick={() => setCurrentPreferredTime('16-20')}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                currentPreferredTime === '16-20'
                  ? 'shadow-[inset_0_0_0_2px_#FF6155]'
                  : ''
              }`}
            >
              16:00 - 20:00
            </button>
          </div>
        </section>

        {/* 구독 플랜 선택 */}
        <section className="flex flex-col gap-5">
          <h2 className="text-display-3 font-semibold">구독 플랜</h2>
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              {...plan}
              isSelected={selectedPlan === plan.id}
              onClick={() => handlePlanClick(plan.id)}
            />
          ))}
        </section>

        {/* 구독 취소 버튼 */}
        <section className="mt-2">
          <GrayButton text="구독 취소" onClick={handleCancelClick} />
        </section>
      </div>

      {/* 구독 정보 변경하기 버튼 */}
      <BottomFixedButton
        as="button"
        type="button"
        onClick={handleChangePlan}
        disabled={!hasChanges}
      >
        구독 정보 변경하기
      </BottomFixedButton>

      {/* 구독 취소 확인 모달 */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="구독을 취소하시겠습니까?"
        description="취소 후에는 다시 구독 신청이 필요합니다."
        confirmText="구독 취소하기"
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelModal(false)}
      />

      {/* 구독 취소 완료 모달 */}
      <ConfirmModal
        isOpen={showCancelCompleteModal}
        title="구독이 취소되었습니다."
        onConfirm={handleCancelCompleteConfirm}
      />

      {/* 플랜 변경 완료 모달 */}
      <ConfirmModal
        isOpen={showChangeCompleteModal}
        title="구독 정보가 변경되었습니다."
        description="변경된 사항은 다음주부터 적용됩니다."
        onConfirm={handleChangeCompleteConfirm}
      />
    </>
  );
}
