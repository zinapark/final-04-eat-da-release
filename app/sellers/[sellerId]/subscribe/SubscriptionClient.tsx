'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import SubscriptionCard from './SubscriptionCard';
import { Product } from '@/app/src/types';

interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  frequency: string;
  portions: string;
  price: number;
}

interface SubscriptionClientProps {
  sellerName: string;
  sellerTier: string;
  sellerRating: number;
  sellerReviewCount: number;
  sellerProfileImage: string;
  sellerDescription: string;
  subscriptionProducts: Product[];
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

const benefits = [
  '매번 고르지 않아도 집밥이 준비돼요',
  '반찬 단품 대비 최대 20% 할인!',
  '구독자만 받을 수 있는 반찬 구성',
  '일정에 맞게 유연한 픽업(픽업 일정 변경 가능)',
  '부담 없이 시작하고 멈출 수 있어요',
];

export default function SubscriptionClient({
  sellerName,
  sellerTier,
  sellerRating,
  sellerReviewCount,
  sellerProfileImage,
  sellerDescription,
  subscriptionProducts,
}: SubscriptionClientProps) {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(selectedPlanId === planId ? null : planId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId) return;

    // 선택된 플랜 찾기
    const selectedPlan = subscriptionPlans.find((p) => p.id === selectedPlanId);

    if (!selectedPlan) {
      alert('선택된 플랜을 찾을 수 없습니다.');
      return;
    }

    // 가격으로 실제 구독권 상품 매칭
    const selectedProduct = subscriptionProducts.find(
      (product) => product.price === selectedPlan.price
    );

    if (!selectedProduct) {
      alert('해당 구독권 상품이 없습니다.');
      return;
    }

    // localStorage에 구독권 구매 정보 저장
    const directPurchase = {
      productId: selectedProduct._id,
      quantity: 1,
      totalAmount: selectedProduct.price,
    };
    localStorage.setItem('directPurchase', JSON.stringify(directPurchase));

    // 구독 전용 구매 페이지로 이동
    router.push('/checkout/subscribe?direct=true');
  };

  return (
    <form id="subscription-form" onSubmit={handleSubmit}>
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        {/* 설명 */}
        <p className="text-display-2 text-gray-600">
          구독을 통해 새로운 반찬을 정기적으로 받아보세요!
        </p>

        {/* 주부 소개글 */}
        <article className="flex items-start gap-2.5 self-stretch pt-3">
          <img
            src={sellerProfileImage}
            alt={`${sellerName} 주부 프로필 이미지`}
            className="h-15 w-15 flex-none rounded-full object-cover"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <header className="flex flex-col gap-0">
              <h3 className="text-paragraph-lg font-semibold text-gray-800">
                {sellerName} {sellerTier}
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
                  {sellerRating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-x-small">
                  ({sellerReviewCount})
                </span>
                <span className="sr-only">
                  평점 5점 만점에 {sellerRating.toFixed(1)}점, 리뷰{' '}
                  {sellerReviewCount}개
                </span>
              </div>
            </header>

            <p className="text-paragraph font-regular text-gray-600">
              {sellerDescription}
            </p>
          </div>
        </article>

        {/* 구독 혜택 */}
        <section className="p-5 border border-gray-300 rounded-lg bg-gray-200">
          <h2 className="text-display-3 font-semibold mb-2">구독 혜택</h2>
          <ul className="space-y-0.5">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-display-1 text-gray-800"
              >
                <span className="text-gray-800">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 구독 플랜 선택 */}
        <section className="flex flex-col gap-5">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              {...plan}
              isSelected={selectedPlanId === plan.id}
              onClick={() => handlePlanClick(plan.id)}
            />
          ))}
        </section>
      </div>

      {selectedPlanId && (
        <BottomFixedButton as="button" formId="subscription-form">
          구독하기
        </BottomFixedButton>
      )}
    </form>
  );
}
