import CompletePageClient from "@/app/checkout/complete/CompletePageClient";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "잇다 구매완료",
  openGraph: {
    title: "잇다 구매완료",
    description: "구매완료 페이지",
    url: "/checkout/complete",
  },
};

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">로딩 중...</p></div>}>
      <CompletePageClient />
    </Suspense>
  );
}
