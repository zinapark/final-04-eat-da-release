'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/src/components/common/Header';
import AddImage from '@/app/src/components/ui/AddImage';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import StarRating from '@/app/src/components/ui/StarItem';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import { fetchOrders, fetchProduct, createReview, uploadReviewImages, getImageUrl } from '@/lib/review';
import { ReviewWriteSkeleton } from './loading';

interface ProductInfo {
  _id: number;
  name: string;
  mainImages?: { path: string; name: string }[];
  seller_name?: string;
  seller?: { name: string };
}

export default function ReviewWritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col">
        <Header title="리뷰작성" showCloseButton />
        <div className="h-[60px]"></div>
        <ReviewWriteSkeleton />
      </div>
    }>
      <ReviewWriteContent />
    </Suspense>
  );
}

function ReviewWriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get('order_id'));
  const productId = Number(searchParams.get('product_id'));

  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState('');

  // 모달 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 상품 정보 로드
  useEffect(() => {
    if (!productId) return;
    fetchProduct(productId)
      .then((item) => setProduct(item))
      .catch((err) => console.error('상품 정보 조회 실패:', err));

    if (orderId) {
      fetchOrders().then((orders) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const order = orders.find((o: any) => o._id === orderId);
        if (order?.createdAt) {
          setPurchaseDate(new Date(order.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, ''));
        }
      }).catch(() => {});
    }
  }, [productId, orderId]);

  const handleImageChange = (newImages: string[], files: File[]) => {
    setImages(newImages);
    setImageFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setModalTitle('별점을 선택해주세요');
      setModalDescription('');
      setIsSuccess(false);
      setIsModalOpen(true);
      return;
    }
    if (!reviewText.trim()) {
      setModalTitle('후기를 작성해주세요');
      setModalDescription('');
      setIsSuccess(false);
      setIsModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      // 이미지 업로드
      let uploadedImages: { path: string; name: string }[] = [];
      if (imageFiles.length > 0) {
        uploadedImages = await uploadReviewImages(imageFiles);
      }

      // 리뷰 작성
      await createReview({
        order_id: orderId,
        product_id: productId,
        rating,
        content: reviewText,
        extra: uploadedImages.length > 0 ? { images: uploadedImages } : undefined,
      });

      setModalTitle('등록되었습니다');
      setModalDescription('');
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      setModalTitle('리뷰 등록에 실패했습니다');
      setModalDescription('잠시 후 다시 시도해주세요.');
      setIsSuccess(false);
      setIsModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      router.back();
    }
  };

  const sellerName = product?.seller_name || product?.seller?.name || '';
  const productImage = product?.mainImages?.[0]?.path || '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <Header title="리뷰작성" showCloseButton />

      {/* 헤더 높이만큼 여백 */}
      <div className="h-[60px]"></div>

      <form
        id="reviewWriteForm"
        onSubmit={handleSubmit}
        className="flex-1 px-5 py-6 overflow-y-auto pb-32"
      >
        {/* 연관된 상품 */}
        <div className="py-4 border-b border-gray-400">
          <div className="flex gap-4 mb-3">
            {productImage ? (
              <Image
                src={getImageUrl(productImage)}
                alt={product?.name || '상품'}
                width={64}
                height={64}
                className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-display-4 font-semibold text-gray-800">
                {product?.name || '상품 정보 로딩 중...'}
              </h3>
              {sellerName && (
                <p className="text-paragraph-sm text-eatda-orange">
                  {sellerName} 주부
                </p>
              )}
              {purchaseDate && (
                <p className="text-xs text-gray-500">{purchaseDate} 구매완료</p>
              )}
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
            onChange={(e) => {
              setReviewText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="솔직한 후기를 남겨주세요."
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2 resize-none overflow-hidden"
            rows={1}
          />
        </div>
      </form>

      {/* 하단 고정 등록 버튼 */}
      <BottomFixedButton as="button" formId="reviewWriteForm">
        {submitting ? '등록 중...' : '등록하기'}
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
