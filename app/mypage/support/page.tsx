import { Metadata } from "next";
import SupportPageClient from "./SupportPageClient";
import Header from "@/app/src/components/common/Header";
import BottomNavigation from "@/app/src/components/common/BottomNavigation";

export const metadata: Metadata = {
  title: "고객센터",
  openGraph: {
    title: "잇다 고객센터",
    description: "고객센터 페이지",
    url: "/mypage/support",
  },
};

export default function SupportPage() {
  return (
    <>
      <Header title={`${metadata.title}`} showBackButton showSearch showCart />
      <SupportPageClient />
      <BottomNavigation />
    </>
  );
}
