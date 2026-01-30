import { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "잇다 구매하기",
  openGraph: {
    title: "잇다 구매페이지",
    description: "구매 페이지",
    url: "/checkout",
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">로딩 중...</p></div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
