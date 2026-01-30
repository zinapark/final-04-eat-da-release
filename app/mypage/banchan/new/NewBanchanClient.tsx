"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddImage from "@/app/src/components/ui/AddImage";
import ConfirmModal from "@/app/src/components/ui/ConfirmModal";
import FormField from "@/app/src/components/ui/FormField";
import CategoryDropdown from "@/app/src/components/ui/CategoryDropdown";
import { uploadImages, createBanchan } from "@/lib/banchan";
import type { BanchanFormData } from "@/app/src/types/banchan";


export default function NewBanchanClient() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imageTouched, setImageTouched] = useState(false);
  const [formData, setFormData] = useState<BanchanFormData>({
    name: "",
    category: "",
    price: "",
    description: "",
    ingredients: "",
    servings: "",
    quantity: "",
    pickupPlace: "",
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
  const handleImageChange = (_images: string[], files: File[]) => {
    setImageFiles(files);
  };

  // 등록 버튼
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 touched 처리
    const allTouched: Record<string, boolean> = {};
    for (const key of Object.keys(formData)) {
      allTouched[key] = true;
    }
    setTouched(allTouched);
    setImageTouched(true);

    // 유효성 검사
    const hasEmpty = Object.entries(formData).some(
      ([, value]) => !value.trim(),
    );
    if (hasEmpty || imageFiles.length === 0) return;
    if (formData.description.trim().length < 10) return;

    setIsSubmitting(true);

    try {
      // 이미지 업로드
      const mainImages = await uploadImages(imageFiles);

      // 반찬 등록
      const success = await createBanchan({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price.replace(/,/g, "")),
        quantity: Number(formData.quantity),
        description: formData.description,
        ingredients: formData.ingredients,
        servings: formData.servings,
        pickupPlace: formData.pickupPlace,
        mainImages,
      });

      if (success) {
        setShowModal(true);
      }
    } catch (error: unknown) {
      console.error("반찬 등록 실패:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("반찬 등록에 실패했습니다. 다시 시도해주세요.");
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
    <form id="new-banchan-form" onSubmit={handleSubmit} noValidate>
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
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
        <div>
          <AddImage onChange={handleImageChange} />
          {imageTouched && imageFiles.length === 0 && (
            <p className="text-x-small text-eatda-orange">
              필수 입력 사항입니다
            </p>
          )}
        </div>

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
          placeholder="잇다 서교동 공유주방"
          required
          error={getError("pickupPlace")}
        />
      </div>

      {/* 제출 중 로딩 표시 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-800">반찬 등록 중...</p>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showModal}
        title="반찬이 등록되었습니다."
        onConfirm={handleModalConfirm}
      />
    </form>
  );
}
