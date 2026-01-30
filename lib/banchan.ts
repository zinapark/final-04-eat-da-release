import { getAxios } from "@/lib/axios";
import type { BanchanData } from "@/app/src/types/banchan";

// 이미지 업로드
export async function uploadImages(
  files: File[],
): Promise<{ path: string; name: string }[]> {
  if (files.length === 0) return [];

  const axios = getAxios();
  const uploadedImages: { path: string; name: string }[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("attach", file);

    const response = await axios.post("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.ok && response.data.item[0]) {
      uploadedImages.push({
        path: response.data.item[0].path,
        name: response.data.item[0].name,
      });
    }
  }

  return uploadedImages;
}

// 카테고리 옵션 (폼 select용)
export const categoryOptions = [
  { value: "", label: "카테고리를 선택해주세요" },
  { value: "main", label: "메인반찬" },
  { value: "soup", label: "국물" },
  { value: "steam", label: "찜" },
  { value: "stir", label: "볶음" },
  { value: "braise", label: "조림" },
  { value: "fry", label: "튀김" },
  { value: "side", label: "밑반찬" },
];

// 카테고리 라벨 매핑 (API 전송용)
const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  categoryOptions.filter((o) => o.value).map((o) => [o.value, o.label]),
);

// 반찬 등록
export async function createBanchan(data: BanchanData): Promise<boolean> {
  try {
    const axios = getAxios();
    const productData = {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      content: data.description,
      mainImages: data.mainImages,
      extra: {
        category: [data.category],
        categoryLabel: CATEGORY_LABELS[data.category] || "",
        ingredients: data.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        servings: data.servings,
        pickupPlace: data.pickupPlace,
      },
    };

    const response = await axios.post("/seller/products", productData);
    return response.data.ok;
  } catch (error) {
    console.error("반찬 등록 실패:", error);
    throw error;
  }
}

// 반찬 수정
export async function updateBanchan(data: BanchanData): Promise<boolean> {
  try {
    const axios = getAxios();
    const productData = {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      content: data.description,
      show: data.show,
      mainImages: data.mainImages,
      extra: {
        category: [data.category],
        categoryLabel: CATEGORY_LABELS[data.category] || "",
        ingredients: data.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        servings: data.servings,
        pickupPlace: data.pickupPlace,
      },
    };

    const response = await axios.patch(
      `/seller/products/${data.id}`,
      productData,
    );
    return response.data.ok;
  } catch (error) {
    console.error("반찬 수정 실패:", error);
    throw error;
  }
}
