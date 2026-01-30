'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/src/components/common/Header';
import AddImage from '@/app/src/components/ui/AddImage';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import StarRating from '@/app/src/components/ui/StarItem';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';

export default function ReviewEditPage() {
  const router = useRouter();

  const [rating, setRating] = useState(0); 
  const [reviewText, setReviewText] = useState('돼지고기 같아요.');
  const [images, setImages] = useState<string[]>([
    '/food1.png',
    '/food2.png',
    '/food1.png',
    '/food2.png'
  ]);

  // 모달 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  const handleImageChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setModalTitle('별점을 선택해주세요');
      setModalDescription('');
      setIsModalOpen(true);
      return;
    }
    if (!reviewText.trim()) {
      setModalTitle('후기를 작성해주세요');
      setModalDescription('');
      setIsModalOpen(true);
      return;
    }

    console.log('리뷰 수정 완료:', { rating, reviewText, images });
    router.back();
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <Header title="리뷰수정" showCloseButton />

      {/* 헤더 높이만큼 여백 */}
      <div className="h-[60px]"></div>

      <form
        id="reviewEditForm"
        onSubmit={handleSubmit}
        className="flex-1 px-5 py-6 overflow-y-auto pb-32"
      >
        {/* 연관된 상품 */}
        <div className="py-4 border-b border-gray-400">
          <div className="flex gap-4 mb-3">
            <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-display-4 font-semibold text-gray-800">
                입에서 녹는 소고기장조림
              </h3>
              <p className="text-paragraph-sm text-eatda-orange">
                김미숙 주부 9단
              </p>
              <p className="text-x-small text-gray-600">2026.01.10 구매완료</p>
            </div>
          </div>
        </div>

        {/* 사진 등록 */}
        <div className="py-6 border-b border-gray-400">
          <h3 className="text-display-4 font-semibold text-gray-800 mb-3">
            사진 등록
          </h3>
          <AddImage 
            onChange={handleImageChange}
            maxImages={5}
            initialImages={images}
            showLabel={false}
          />
        </div>

        {/* 별점 */}
        <div className="py-6 border-b border-gray-400">
          <h3 className="text-display-4 font-semibold text-gray-800 mb-3">
            반찬은 어떠셨나요? <span className="text-eatda-orange">*</span>
          </h3>
          <div className="flex justify-center">
            <StarRating 
              rating={rating}
              onRatingChange={setRating}
              size={25}
            />
          </div>
        </div>

        {/* 반찬 후기 */}
        <div className="pt-6">
          <h3 className="text-display-4 font-semibold text-gray-800 mb-3">
            반찬 후기 <span className="text-eatda-orange">*</span>
          </h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="솔직한 후기를 남겨주세요."
            className="w-full min-h-[80px] text-paragraph text-gray-800 placeholder:text-gray-500 resize-none focus:outline-none"
          />
        </div>
        <div className="border-b border-gray-400"></div>
      </form>

      {/* 하단 고정 등록 버튼 */}
      <BottomFixedButton as="button" formId="reviewEditForm">
        등록하기
      </BottomFixedButton>

      {/* ConfirmModal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title={modalTitle}
        description={modalDescription}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}