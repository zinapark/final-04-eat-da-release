import { Metadata } from "next";
import Header from "@/app/src/components/common/Header";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "정보 확인",
  description: "개인 정보 확인 페이지",
};

export default function AccountVerifyPage() {
  return (
    <>
      <Header title={`${metadata.title}`} showCloseButton />
      <VerifyClient />
    </>
  );
}
