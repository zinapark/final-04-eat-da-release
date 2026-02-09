'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/src/components/common/Header';
import AddImage from '@/app/src/components/ui/AddImage';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import StarRating from '@/app/src/components/ui/StarItem';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import { fetchMyReviews, fetchProduct, updateReview, uploadReviewImages, getImageUrl } from '@/lib/review';
import { ReviewEditSkeleton } from './loading';

export default function ReviewEditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col">
        <Header title="리뷰수정" showCloseButton />
        <div className="h-[60px]"></div>
        <ReviewEditSkeleton />
      </div>
    }>
      <ReviewEditContent />
    </Suspense>
  );
}

function ReviewEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const replyId = Number(searchParams.get('reply_id'));

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ path: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 상품 정보
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  // 모달 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 기존 리뷰 데이터 로드 (fetchMyReviews로 전체 조회 후 해당 리뷰 찾기)
  useEffect(() => {
    if (!replyId) return;
    setLoading(true);
    fetchMyReviews()
      .then((reviews) => {
        const item = reviews.find((r: { _id: number }) => Number(r._id) === replyId);
        if (!item) return;

        setRating(item.rating || 0);
        setReviewText(item.content || '');

        const imgs = item.extra?.images || [];
        setExistingImages(imgs);
        setImages(imgs.map((img: { path: string }) => getImageUrl(img.path)));

        setProductName(item.product?.name || '');
        setSellerName(item.product?.seller_name || '');
        setProductImage(item.product?.image?.path || '');
        if (item.createdAt) {
          setPurchaseDate(new Date(item.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, ''));
        }

        // seller_name이 없으면 상품 정보에서 가져오기
        const pid = item.product?._id || item.product_id;
        if (!item.product?.seller_name && pid) {
          fetchProduct(pid).then((p) => {
            if (p?.seller_name) setSellerName(p.seller_name);
            else if (p?.seller?.name) setSellerName(p.seller.name);
          }).catch(() => {});
        }
      })
      .catch((err) => {
        console.error('리뷰 조회 실패:', err);
      })
      .finally(() => setLoading(false));
  }, [replyId]);

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
      // 새로 추가된 파일만 업로드
      let newUploadedImages: { path: string; name: string }[] = [];
      if (imageFiles.length > 0) {
        newUploadedImages = await uploadReviewImages(imageFiles);
      }

      // 기존에 남아있는 이미지 + 새로 업로드된 이미지
      // 기존 이미지 중 삭제되지 않은 것 필터링
      const remainingExisting = existingImages.filter((img) =>
        images.some((url) => url.includes(img.path))
      );
      const allImages = [...remainingExisting, ...newUploadedImages];

      await updateReview(replyId, {
        rating,
        content: reviewText,
        extra: { images: allImages },
      });

      setModalTitle('수정되었습니다');
      setModalDescription('');
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      setModalTitle('리뷰 수정에 실패했습니다');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header title="리뷰수정" showCloseButton />
        <div className="h-[60px]"></div>
        <ReviewEditSkeleton />
      </div>
    );
  }

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
            {productImage ? (
              <Image
                src={getImageUrl(productImage)}
                alt={productName}
                width={64}
                height={64}
                className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-display-4 font-semibold text-gray-800">
                {productName || '상품명 없음'}
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
            initialImages={images}
            showLabel={false}
          />
        </div>

        {/* 별점 */}
        <div className="py-6 ">
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
      <BottomFixedButton as="button" formId="reviewEditForm">
        {submitting ? '수정 중...' : '등록하기'}
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
