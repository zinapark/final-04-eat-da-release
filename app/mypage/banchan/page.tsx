import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import BanchanManagementClient from "@/app/mypage/banchan/BanchanManagementClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "반찬 관리",
  description: "판매자 반찬 관리 페이지",
};

export default function BanchanManagement() {
  return (
    <>
      <Header title={`${metadata.title}`} showBackButton showSearch showCart />
      <BanchanManagementClient />
      <BottomFixedButton as="link" href="/mypage/banchan/new">
        새 반찬 등록하기
      </BottomFixedButton>
    </>
  );
}
