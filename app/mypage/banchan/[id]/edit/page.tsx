import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import EditBanchanClient from "./EditBanchanClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "반찬 수정",
  description: "반찬 수정 페이지",
};

interface EditBanchanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBanchanPage({
  params,
}: EditBanchanPageProps) {
  const { id } = await params;

  return (
    <>
      <Header title={`${metadata.title}`} showCloseButton />
      <EditBanchanClient id={id} />
      <BottomFixedButton as="button" formId="edit-banchan-form">
        수정하기
      </BottomFixedButton>
    </>
  );
}
