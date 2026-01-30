import { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "잇다 구매하기",
  openGraph: {
    title: "잇다 구매페이지",
    description: "구매 페이지",
    url: "/checkout",
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
