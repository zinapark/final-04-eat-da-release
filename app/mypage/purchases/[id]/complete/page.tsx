import { OrderDetail } from "@/app/mypage/purchases/[id]/PurchasesDetailCard";
import PickupCompleteClient from "./PickupCompleteClient";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "픽업 완료!",
  description: "픽업 완료 페이지",
};

// 임시 주문 데이터
const mockOrder: OrderDetail = {
  orderNumber: "00000001",
  pickupLocation: "서교동 공유주방",
  pickupTime: "10:00 - 11:00",
  totalPrice: 16500,
  product: {
    imageSrc: "/food1.png",
    dishName: "입에서 녹는 소고기장조림",
    chefName: "김미숙 주부 9단",
    price: 8500,
  },
};

export default function PickupCompletePage() {
  return (
    <>
      <Header title={`${metadata.title}`} />
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        {/* 픽업 완료 안내 */}

        <div className="mt-2 text-paragraph text-gray-600">
          <p>오늘의 집밥을 잘 전달했어요.</p>
          <p>맛있게 드세요!</p>
        </div>

        {/* 주문 상세 정보 + 리뷰 쓰기 버튼 */}
        <PickupCompleteClient order={mockOrder} />
      </div>

      {/* 홈 이동 버튼 */}
      <BottomFixedButton as="link" href="/">
        홈으로
      </BottomFixedButton>
    </>
  );
}
