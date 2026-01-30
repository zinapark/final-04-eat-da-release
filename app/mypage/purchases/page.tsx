import PurchasesClient from "@/app/mypage/purchases/PurchasesClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "구매 내역",
  description: "구매 내역 페이지",
};

export default function MyPage() {
  return (
    <>
      <Header title={`${metadata.title}`} showBackButton showSearch showCart />
      <PurchasesClient />
    </>
  );
}
