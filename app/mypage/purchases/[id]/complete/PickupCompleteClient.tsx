"use client";

import { useRouter } from "next/navigation";
import PurchasesDetailCard, {
  OrderDetail,
} from "@/app/mypage/purchases/[id]/PurchasesDetailCard";
import GrayButton from "@/app/src/components/ui/GrayButton";

interface PickupCompleteClientProps {
  order: OrderDetail;
}

export default function PickupCompleteClient({
  order,
}: PickupCompleteClientProps) {
  const router = useRouter();

  const handleReviewClick = () => {
    router.push("/review");
  };

  return (
    <section className="flex flex-col gap-5">
      <PurchasesDetailCard order={order} />

      {/* 리뷰 쓰기 버튼 */}
      <GrayButton text="리뷰 쓰기" onClick={handleReviewClick} />
    </section>
  );
}
