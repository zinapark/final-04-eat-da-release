import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import EditBanchanClient from "./EditBanchanClient";
import Header from "@/app/src/components/common/Header";
import { Metadata } from "next";
import { getAxios } from "@/lib/axios";

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

  const axios = getAxios();
  const response = await axios.get(`/seller/products/${id}`);

  if (!response.data.ok || !response.data.item) {
    return <div>반찬을 찾을 수 없습니다.</div>;
  }

  const banchan = response.data.item;

  // ingredients가 배열이면 쉼표로 연결
  const ingredients = Array.isArray(banchan.extra?.ingredients)
    ? banchan.extra.ingredients.join(", ")
    : banchan.extra?.ingredients || "";

  const category = Array.isArray(banchan.extra?.category)
    ? banchan.extra.category[0] || ""
    : banchan.extra?.category || "";

  const initialData = {
    id: banchan._id,
    name: banchan.name,
    category,
    price: banchan.price.toLocaleString(),
    description: banchan.content || banchan.extra?.description || "",
    ingredients,
    servings: banchan.extra?.servings || "",
    quantity: banchan.quantity?.toString() || "",
    pickupPlace: banchan.extra?.pickupPlace || "",
    images: banchan.mainImages?.map((img: { path: string }) => img.path) || [],
    show: banchan.show !== false,
  };

  return (
    <>
      <Header title={`${metadata.title}`} showCloseButton />
      <EditBanchanClient initialData={initialData} />
      <BottomFixedButton as="button" formId="edit-banchan-form">
        수정하기
      </BottomFixedButton>
    </>
  );
}
