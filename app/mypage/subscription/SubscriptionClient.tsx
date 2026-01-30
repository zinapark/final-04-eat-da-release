"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import ConfirmModal from "@/app/src/components/ui/ConfirmModal";
import SubscriptionCard from "@/app/mypage/subscription/SubscriptionCard";

interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  frequency: string;
  portions: string;
  price: number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "light",
    title: "가볍게 잇는 집밥",
    description: "주 2~3회만 집밥을 먹는 분에게 추천!",
    frequency: "주 1회",
    portions: "픽업당 반찬 3종",
    price: 15000,
  },
  {
    id: "standard",
    title: "생활에 자리 잡은 집밥",
    description: "평일 저녁을 자주 집에서 먹는 분에게 추천!",
    frequency: "주 2회",
    portions: "픽업당 반찬 3~4종",
    price: 28000,
  },
  {
    id: "full",
    title: "식탁을 맡기는 집밥",
    description: "거의 매일 집밥을 먹는 자취생에게 추천!",
    frequency: "주 3회",
    portions: "픽업당 반찬 4종",
    price: 39000,
  },
];

const benefits = [
  "매번 고르지 않아도 집밥이 준비돼요",
  "반찬 단품 대비 최대 20% 할인!",
  "구독자만 받을 수 있는 반찬 구성",
  "일정에 맞게 유연한 픽업(픽업 일정 변경 가능)",
  "부담 없이 시작하고 멈출 수 있어요",
];

export default function SubscriptionClient() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePlanClick = (planId: string) => {
    setSelectedPlan(selectedPlan === planId ? null : planId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push("/mypage");
  };

  return (
    <form id="subscription-form" onSubmit={handleSubmit}>
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        {/* 설명 */}
        <p className="text-display-2 text-gray-600">
          구독을 통해 새로운 반찬을 정기적으로 받아보세요!
        </p>

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
              isSelected={selectedPlan === plan.id}
              onClick={() => handlePlanClick(plan.id)}
            />
          ))}
        </section>
      </div>

      {selectedPlan && (
        <BottomFixedButton as="button" formId="subscription-form">
          신청하기
        </BottomFixedButton>
      )}

      <ConfirmModal
        isOpen={showModal}
        title="반찬 구독이 완료되었습니다."
        onConfirm={handleModalConfirm}
      />
    </form>
  );
}
