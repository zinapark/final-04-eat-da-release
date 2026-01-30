import WishlistPageClient from "./WishlistPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "잇다 찜 목록",
  openGraph: {
    title: "잇다 찜 목록",
    description: "찜 페이지",
    url: "/wishlist",
  },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
