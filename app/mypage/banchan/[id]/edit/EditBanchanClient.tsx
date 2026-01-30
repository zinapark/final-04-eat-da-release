"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddImage from "@/app/src/components/ui/AddImage";
import ConfirmModal from "@/app/src/components/ui/ConfirmModal";
import FormField from "@/app/src/components/ui/FormField";
import CategoryDropdown from "@/app/src/components/ui/CategoryDropdown";
import { uploadImages, updateBanchan } from "@/lib/banchan";
import type {
  BanchanFormData,
  EditBanchanClientProps,
} from "@/app/src/types/banchan";

export default function EditBanchanClient({
  initialData,
}: EditBanchanClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnSale, setIsOnSale] = useState(initialData.show);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData.images,
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<BanchanFormData>({
    name: initialData.name,
    category: initialData.category,
    price: initialData.price,
    description: initialData.description,
    ingredients: initialData.ingredients,
    servings: initialData.servings,
    quantity: initialData.quantity,
    pickupPlace: initialData.pickupPlace,
  });

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 필드별 에러 메시지
  const getError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    const value = formData[field as keyof BanchanFormData];
    if (!value.trim()) return "필수 입력 사항입니다";
    if (field === "description" && value.trim().length < 10) {
      return "최소 10자 이상 입력해주세요";
    }
    return undefined;
  };

  // 입력값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (images: string[], files: File[]) => {
    setImageFiles(files);
    // 기존 이미지 중 남아있는 것만 유지
    const newExistingImages = images.filter((img) =>
      initialData.images.includes(img),
    );
    setExistingImages(newExistingImages);
  };

  // 수정 버튼
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 touched 처리
    const allTouched: Record<string, boolean> = {};
    for (const key of Object.keys(formData)) {
      allTouched[key] = true;
    }
    setTouched(allTouched);

    // 유효성 검사
    const hasEmpty = Object.entries(formData).some(
      ([, value]) => !value.trim(),
    );
    if (hasEmpty) return;
    if (formData.description.trim().length < 10) return;

    setIsSubmitting(true);

    try {
      // 새 이미지 업로드
      const newUploadedImages = await uploadImages(imageFiles);

      // 기존 이미지 + 새 이미지 합치기
      const existingImageObjects = existingImages.map((path) => ({
        path,
        name: path.split("/").pop() || "",
      }));
      const mainImages = [...existingImageObjects, ...newUploadedImages];

      // 반찬 수정
      const success = await updateBanchan({
        id: initialData.id,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price.replace(/,/g, "")),
        quantity: Number(formData.quantity),
        description: formData.description,
        ingredients: formData.ingredients,
        servings: formData.servings,
        pickupPlace: formData.pickupPlace,
        show: isOnSale,
        mainImages,
      });

      if (success) {
        setShowModal(true);
      }
    } catch (error: unknown) {
      console.error("반찬 수정 실패:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("반찬 수정에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 확인 버튼
  const handleModalConfirm = () => {
    setShowModal(false);
    router.push("/mypage/banchan");
  };

  return (
    <form
      id="edit-banchan-form"
      onSubmit={handleSubmit}
      className="flex flex-col"
      noValidate
    >
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        {/* 판매중/판매중지 버튼 */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setIsOnSale(true)}
            className={`flex-1 h-12 rounded-lg text-display-1 font-semibold border transition-colors ${
              isOnSale
                ? "bg-eatda-orange text-white border-eatda-orange"
                : "bg-gray-200 text-gray-800 border-gray-300"
            }`}
          >
            판매중
          </button>
          <button
            type="button"
            onClick={() => setIsOnSale(false)}
            className={`flex-1 h-12 rounded-lg text-display-1 font-semibold border transition-colors ${
              !isOnSale
                ? "bg-eatda-orange text-white border-eatda-orange"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            판매중지
          </button>
        </div>
        {/* 입력 필드 영역 - 판매중지 시 비활성화 */}
        <fieldset
          disabled={!isOnSale}
          className={`flex flex-col gap-7.5 ${!isOnSale ? "text-gray-500 opacity-70" : ""}`}
        >
          {/* 반찬 이름 */}
          <FormField
            label="반찬 이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            placeholder="예: 불향 가득 제육볶음"
            required
            error={getError("name")}
          />

          {/* 반찬 이미지 등록 */}
          <AddImage
            initialImages={initialData.images}
            onChange={handleImageChange}
            maxImages={5}
          />

          {/* 반찬 종류 */}
          <CategoryDropdown
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            onBlur={() => handleBlur("category")}
            error={
              touched.category && !formData.category
                ? "필수 입력 사항입니다"
                : undefined
            }
            disabled={!isOnSale}
          />

          {/* 가격 */}
          <FormField
            label="가격 (원)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onBlur={() => handleBlur("price")}
            placeholder="5,000"
            required
            error={getError("price")}
          />

          {/* 설명 */}
          <FormField
            label="설명"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur("description")}
            placeholder="반찬에 대한 소개를 작성해주세요"
            required
            error={getError("description")}
          />

          {/* 재료 */}
          <FormField
            label="재료"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            onBlur={() => handleBlur("ingredients")}
            placeholder={`재료를 쉼표로 구분해주세요\n(예: 김치, 돼지고기, 두부)`}
            as="textarea"
            required
            error={getError("ingredients")}
          />

          {/* 인분 */}
          <FormField
            label="인분"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            onBlur={() => handleBlur("servings")}
            placeholder="2"
            required
            error={getError("servings")}
          />

          {/* 재고 수량 */}
          <FormField
            label="재고 수량"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            onBlur={() => handleBlur("quantity")}
            placeholder="20"
            required
            error={getError("quantity")}
          />

          {/* 픽업 장소 */}
          <FormField
            label="픽업 장소"
            name="pickupPlace"
            value={formData.pickupPlace}
            onChange={handleChange}
            onBlur={() => handleBlur("pickupPlace")}
            placeholder="서교동 공유주방"
            required
            error={getError("pickupPlace")}
          />
        </fieldset>
      </div>

      {/* 제출 중 로딩 표시 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-800">반찬 수정 중...</p>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showModal}
        title="반찬 정보가 변경되었습니다."
        description="변경된 정보로 상품이 노출됩니다."
        onConfirm={handleModalConfirm}
      />
    </form>
  );
}
