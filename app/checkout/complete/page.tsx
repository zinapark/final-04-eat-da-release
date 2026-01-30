import CompletePageClient from "@/app/checkout/complete/CompletePageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "잇다 구매완료",
  openGraph: {
    title: "잇다 구매완료",
    description: "구매완료 페이지",
    url: "/checkout/complete",
  },
};

export default function CheckoutCompletePage() {
  return <CompletePageClient />;
}
