"use client";

import { useRouter } from "next/navigation";
import PurchasesDetailCard, {
  OrderDetail,
} from "@/app/mypage/purchases/[id]/PurchasesDetailCard";
import GrayButton from "@/app/src/components/ui/GrayButton";

interface PurchaseDetailClientProps {
  orders: OrderDetail[];
}

export default function PurchaseDetailClient({
  orders,
}: PurchaseDetailClientProps) {
  const router = useRouter();

  const handlePickupComplete = async (orderNumber: string) => {
    router.push(`/mypage/purchases/${orderNumber}/complete`);
  };

  return (
    <section className="flex-1 flex flex-col gap-5 pb-5">
      {orders.map((order) => (
        <div key={order.orderNumber} className="flex flex-col gap-5">
          <PurchasesDetailCard order={order} />
          <GrayButton
            text="픽업 완료"
            onClick={() => handlePickupComplete(order.orderNumber)}
          />
        </div>
      ))}
    </section>
  );
}
