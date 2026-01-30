import { getAxios } from "@/lib/axios";
import type {
  BanchanData,
  BanchanFormData,
  EditBanchanInitialData,
} from "@/app/src/types/banchan";

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

// 판매자 반찬 상세 조회 + 폼용 데이터 가공
export async function fetchBanchanForEdit(
  id: string,
): Promise<EditBanchanInitialData> {
  const axios = getAxios();
  const response = await axios.get(`/seller/products/${id}`);

  if (!response.data.ok || !response.data.item) {
    throw new Error("반찬을 찾을 수 없습니다.");
  }

  const banchan = response.data.item;

  const ingredients = Array.isArray(banchan.extra?.ingredients)
    ? banchan.extra.ingredients.join(", ")
    : banchan.extra?.ingredients || "";

  const category = Array.isArray(banchan.extra?.category)
    ? banchan.extra.category[0] || ""
    : banchan.extra?.category || "";

  const images =
    banchan.mainImages?.map((img: { path: string }) => img.path) || [];

  return {
    id: banchan._id,
    name: banchan.name,
    category,
    price: banchan.price.toLocaleString(),
    description: banchan.content || banchan.extra?.description || "",
    ingredients,
    servings: banchan.extra?.servings || "",
    quantity: ((banchan.quantity ?? 0) - (banchan.buyQuantity ?? 0)).toString(),
    buyQuantity: banchan.buyQuantity ?? 0,
    pickupPlace: banchan.extra?.pickupPlace || "",
    images,
    show: banchan.show !== false,
  };
}

// 반찬 폼 유효성 검사
export function validateBanchanForm(
  formData: BanchanFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (!value.trim()) {
      errors[key] = "필수 입력 사항입니다";
    }
  }

  if (formData.description.trim() && formData.description.trim().length < 10) {
    errors.description = "최소 10자 이상 입력해주세요";
  }

  return errors;
}
