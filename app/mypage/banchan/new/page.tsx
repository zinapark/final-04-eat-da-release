import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import NewBanchanClient from "@/app/mypage/banchan/new/NewBanchanClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "새 반찬 등록",
  description: "새 반찬 등록 페이지",
};

export default function NewBanchan() {
  return (
    <>
      <Header title={`${metadata.title}`} showCloseButton />
      <NewBanchanClient />
      <BottomFixedButton as="button" formId="new-banchan-form">
        등록하기
      </BottomFixedButton>
    </>
  );
}
