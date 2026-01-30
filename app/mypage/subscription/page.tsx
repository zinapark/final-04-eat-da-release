import { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";
import Header from "@/app/src/components/common/Header";

export const metadata: Metadata = {
  title: "반찬 구독",
  description: "반찬 구독 신청 페이지",
};

export default function SubscriptionPage() {
  return (
    <>
      <Header title={`${metadata.title}`} showCloseButton />
      <SubscriptionClient />
    </>
  );
}
