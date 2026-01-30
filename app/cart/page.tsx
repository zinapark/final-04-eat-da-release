import { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "잇다 장바구니",
  openGraph: {
    title: "잇다 장바구니",
    description: "장바구니 페이지",
    url: "/cart",
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
