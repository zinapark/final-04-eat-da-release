import PickupCompleteClient from "./PickupCompleteClient";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문 상태 조회",
  description: "주문 정보 상태 상세 조회 페이지",
};

export default async function PickupCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PickupCompleteClient orderId={id} />

      {/* 홈 이동 버튼 */}
      <BottomFixedButton as="link" href="/">
        홈으로
      </BottomFixedButton>
    </>
  );
}
