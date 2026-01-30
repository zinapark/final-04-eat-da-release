import { OrderDetail } from "@/app/mypage/purchases/[id]/PurchasesDetailCard";
import PurchaseDetailClient from "./PurchaseDetailClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";
import { banchanList, BanchanItem } from "@/app/mypage/banchan/BanchanData";

export const metadata: Metadata = {
  title: "구매 내역 정보",
  description: "구매 내역 상세 정보 페이지",
};

// BanchanData를 기반으로 주문 데이터 생성
const pickupTimes = [
  "10:00 - 11:00",
  "12:00 - 13:00",
  "15:00 - 16:00",
  "18:00 - 19:00",
];

const orderData: OrderDetail[] = banchanList.items.map(
  (item: BanchanItem, index: number) => ({
    orderNumber: `0000000${index + 1}`,
    pickupLocation: item.extra.pickupLocation,
    pickupTime: pickupTimes[index % pickupTimes.length],
    totalPrice: item.price * item.quantity,
    product: {
      imageSrc: item.mainImages[0]?.path || "/food1.png",
      dishName: item.name,
      chefName: `${item.seller.name} 주부 9단`,
      price: item.price,
    },
  }),
);

export default function PurchaseDetailPage() {
  return (
    <>
      <Header title={`${metadata.title}`} showBackButton showSearch showCart />
      <div
        className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]
"
      >
        <PurchaseDetailClient orders={orderData} />
      </div>
    </>
  );
}
