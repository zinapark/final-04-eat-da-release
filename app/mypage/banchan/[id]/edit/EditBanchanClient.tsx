'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AddImage from '@/app/src/components/ui/AddImage';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import FormField from '@/app/src/components/ui/FormField';
import CategoryDropdown from '@/app/src/components/ui/CategoryDropdown';
import {
  uploadImages,
  updateBanchan,
  deleteBanchan,
  fetchBanchanForEdit,
  validateBanchanForm,
} from '@/lib/banchan';
import type {
  BanchanFormData,
  EditBanchanClientProps,
} from '@/app/src/types/banchan';
import { EditBanchanSkeleton } from '@/app/mypage/banchan/[id]/edit/loading';

export default function EditBanchanClient({ id }: EditBanchanClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnSale, setIsOnSale] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [buyQuantity, setBuyQuantity] = useState(0);
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [formData, setFormData] = useState<BanchanFormData>({
    name: '',
    category: '',
    price: '',
    description: '',
    ingredients: '',
    servings: '',
    quantity: '',
    pickupPlace: '',
    pickupAddress: '',
  });

  // 이미 복원했는지 추적하는 ref (useEffect 중복 실행 방지)
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current) return;

    const savedFormState = sessionStorage.getItem('editBanchanFormState');

    if (savedFormState) {
      hasRestoredRef.current = true;
      try {
        const saved = JSON.parse(savedFormState);
        setFormData(saved.formData);
        setPickupAddress(saved.pickupAddress);
        setIsOnSale(saved.isOnSale);
        setExistingImages(saved.existingImages);
      } catch {
        // white screen 방지용 trycatch
      }
      sessionStorage.removeItem('editBanchanFormState');
    }

    fetchBanchanForEdit(id)
      .then((data) => {
        if (!savedFormState) {
          setFormData({
            name: data.name,
            category: data.category,
            price: data.price,
            description: data.description,
            ingredients: data.ingredients,
            servings: data.servings,
            quantity: data.quantity,
            pickupPlace: data.pickupPlace,
            pickupAddress: data.pickupAddress,
          });
          setPickupAddress(data.pickupAddress);
          setIsOnSale(data.show);
          setExistingImages(data.images);
        }
        setBuyQuantity(data.buyQuantity);
        setInitialImages(data.images);
      })
      .catch(() => {
        if (!savedFormState) {
          alert('반찬 정보를 불러오지 못했습니다.');
          router.back();
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  // 지도에서 돌아왔을 때 selectedKitchen 복원
  useEffect(() => {
    const selectedKitchen = sessionStorage.getItem('selectedKitchen');
    if (selectedKitchen) {
      try {
        const kitchen = JSON.parse(selectedKitchen);
        setFormData((prev) => ({
          ...prev,
          pickupPlace: kitchen.name,
          pickupAddress: kitchen.address,
        }));
        setPickupAddress(kitchen.address);
      } catch {
        // white screen 방지용 trycatch
      }
      sessionStorage.removeItem('selectedKitchen');
    }
  }, []);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    const errors = validateBanchanForm(formData);
    return errors[field];
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (images: string[], files: File[]) => {
    setImageFiles(files);
    const newExistingImages = images.filter((img) =>
      initialImages.includes(img)
    );
    setExistingImages(newExistingImages);
  };

  // 지도 페이지로 이동하기 전 현재 폼 상태 저장
  const handleNavigateToMap = () => {
    const dataToSave = {
      formData,
      pickupAddress,
      isOnSale,
      existingImages,
    };
    sessionStorage.setItem('editBanchanFormState', JSON.stringify(dataToSave));
    router.push('/mypage/map');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 touched 처리
    const allTouched: Record<string, boolean> = {};
    for (const key of Object.keys(formData)) {
      allTouched[key] = true;
    }
    setTouched(allTouched);

    // 유효성 검사
    const errors = validateBanchanForm(formData);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const newUploadedImages = await uploadImages(imageFiles);

      const existingImageObjects = existingImages.map((path) => ({
        path,
        name: path.split('/').pop() || '',
      }));
      const mainImages = [...existingImageObjects, ...newUploadedImages];

      const success = await updateBanchan({
        id: Number(id),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price.replace(/,/g, '')),
        quantity: Number(formData.quantity) + buyQuantity,
        description: formData.description,
        ingredients: formData.ingredients,
        servings: formData.servings,
        pickupPlace: formData.pickupPlace,
        pickupAddress: pickupAddress,
        show: isOnSale,
        mainImages,
      });

      if (success) {
        setShowModal(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('반찬 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.replace('/mypage/banchan');
  };

  const handleDelete = async () => {
    try {
      await deleteBanchan(Number(id));
      router.replace('/mypage/banchan');
    } catch {
      alert('반찬 삭제에 실패했습니다. 다시 시도해주세요.');
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return <EditBanchanSkeleton />;
  }

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
                ? 'bg-eatda-orange text-white border-eatda-orange'
                : 'bg-gray-200 text-gray-800 border-gray-300'
            }`}
          >
            판매중
          </button>
          <button
            type="button"
            onClick={() => setIsOnSale(false)}
            className={`flex-1 h-12 rounded-lg text-display-1 font-semibold border transition-colors ${
              !isOnSale
                ? 'bg-eatda-orange text-white border-eatda-orange'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
          >
            판매중지
          </button>
        </div>
        {/* 입력 필드 영역 - 판매중지 시 비활성화 */}
        <fieldset
          disabled={!isOnSale}
          className={`flex flex-col gap-5 ${!isOnSale ? 'text-gray-500 opacity-70' : ''}`}
        >
          {/* 반찬 이름 */}
          <FormField
            label="반찬 이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            placeholder="예: 불향 가득 제육볶음"
            required
            error={getError('name')}
          />

          {/* 반찬 이미지 등록 */}
          <AddImage
            initialImages={initialImages}
            onChange={handleImageChange}
            maxImages={5}
          />

          {/* 반찬 종류 */}
          <CategoryDropdown
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            onBlur={() => handleBlur('category')}
            error={
              touched.category && !formData.category
                ? '필수 입력 사항입니다'
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
            onBlur={() => handleBlur('price')}
            placeholder="5,000"
            required
            error={getError('price')}
          />

          {/* 설명 */}
          <FormField
            label="설명"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur('description')}
            placeholder="반찬에 대한 소개를 작성해주세요"
            required
            as="textarea"
            error={getError('description')}
          />

          {/* 재료 */}
          <FormField
            label="재료"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            onBlur={() => handleBlur('ingredients')}
            placeholder={`재료를 쉼표로 구분해주세요\n(예: 김치, 돼지고기, 두부)`}
            as="textarea"
            required
            error={getError('ingredients')}
          />

          {/* 인분 */}
          <FormField
            label="인분"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            onBlur={() => handleBlur('servings')}
            placeholder="2"
            required
            error={getError('servings')}
          />

          {/* 재고 수량 */}
          <FormField
            label="재고 수량"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            onBlur={() => handleBlur('quantity')}
            placeholder="20"
            required
            error={getError('quantity')}
          />

          {/* 픽업 장소 */}
          <div>
            <label className="block text-display-2 font-semibold text-gray-800">
              픽업 장소 <span className="text-eatda-orange">*</span>
            </label>
            <button
              type="button"
              onClick={handleNavigateToMap}
              className="w-full py-2 border-b border-gray-400 text-left"
            >
              {formData.pickupPlace ? (
                <>
                  <p className="text-display-2 text-gray-800">
                    {formData.pickupPlace}
                  </p>
                  {pickupAddress && (
                    <p className="text-display-1 text-gray-500">
                      {pickupAddress}
                    </p>
                  )}
                </>
              ) : (
                <span className="text-gray-500 text-display-2">
                  공유주방을 선택해주세요
                </span>
              )}
            </button>

            {(getError('pickupPlace') || getError('pickupAddress')) && (
              <p className="text-x-small text-eatda-orange mt-1">
                {!formData.pickupPlace
                  ? '필수 입력 사항입니다'
                  : '공유주방을 다시 선택해주세요'}
              </p>
            )}
          </div>
        </fieldset>

        {/* 삭제 */}
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-display-2 font-semibold text-gray-800 underline self-start"
        >
          삭제하기
        </button>
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

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="반찬을 삭제하시겠습니까?"
        description="삭제된 반찬은 복구할 수 없습니다."
        confirmText="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </form>
  );
}
