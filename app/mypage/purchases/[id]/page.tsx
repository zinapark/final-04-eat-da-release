import PurchaseDetailClient from "./PurchaseDetailClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "구매 내역 정보",
  description: "구매 내역 상세 정보 페이지",
};

export default async function PurchaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header title={`${metadata.title}`} showBackButton showSearch showCart />
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        <PurchaseDetailClient orderId={id} />
      </div>
    </>
  );
}