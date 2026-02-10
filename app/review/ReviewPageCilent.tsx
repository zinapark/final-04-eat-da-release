'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/src/components/common/Header';
import StarItem from '@/app/src/components/ui/StarItem';
import GrayButton from '@/app/src/components/ui/GrayButton';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import {
  fetchOrders,
  fetchMyReviews,
  fetchProduct,
  deleteReview,
  getImageUrl,
} from '@/lib/review';
import { ReviewCardListSkeleton } from './loading';

interface OrderProduct {
  _id: number;
  name: string;
  image: { path: string };
  seller_name: string;
  quantity: number;
}

interface Order {
  _id: number;
  state: string;
  products: OrderProduct[];
  createdAt: string;
}

interface ReviewItem {
  _id: number;
  order_id: number;
  rating: number;
  content: string;
  product: {
    _id: number;
    name: string;
    image: { path: string };
    seller_name: string;
  };
  createdAt: string;
  extra?: {
    images?: { path: string; name: string }[];
  };
}

// 주문에서 리뷰 작성 가능한 상품 목록 추출
interface AvailableItem {
  order_id: number;
  product_id: number;
  product_name: string;
  seller_name: string;
  image_path: string;
  purchase_date: string;
}

export default function ReviewManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');
  const [availableItems, setAvailableItems] = useState<AvailableItem[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 작성 가능한 리뷰 불러오기
  const loadAvailableReviews = async () => {
    setLoading(true);
    try {
      const [orders, reviews] = await Promise.all([
        fetchOrders(),
        fetchMyReviews(),
      ]);
      // 상품별 리뷰 작성 수 카운트
      const reviewCountByProduct = new Map<number, number>();
      reviews.forEach((r: ReviewItem) => {
        const pid = r.product._id;
        reviewCountByProduct.set(pid, (reviewCountByProduct.get(pid) || 0) + 1);
      });

      const items: AvailableItem[] = [];
      // 오래된 주문부터 처리 (이미 리뷰한 건은 앞에서부터 차감)
      const sortedOrders = [...orders].sort(
        (a: Order, b: Order) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      for (const order of sortedOrders) {
        // 구매완료 상태(OS080)인 주문만
        if (order.state === 'OS080') {
          for (const product of order.products) {
            const remaining = reviewCountByProduct.get(product._id) || 0;
            if (remaining > 0) {
              reviewCountByProduct.set(product._id, remaining - 1);
              continue;
            }
            items.push({
              order_id: order._id,
              product_id: product._id,
              product_name: product.name,
              seller_name: product.seller_name || '',
              image_path: product.image?.path || '',
              purchase_date: new Date(order.createdAt)
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '.')
                .replace(/\.$/, ''),
            });
          }
        }
      }

      // seller_name이 없는 항목은 상품 정보에서 가져오기
      const missingIds = [
        ...new Set(
          items.filter((i) => !i.seller_name).map((i) => i.product_id)
        ),
      ];
      if (missingIds.length > 0) {
        const productDetails = await Promise.all(
          missingIds.map((id) => fetchProduct(id).catch(() => null))
        );
        const sellerMap = new Map<number, string>();
        productDetails.forEach((p, idx) => {
          if (p)
            sellerMap.set(
              missingIds[idx],
              p.seller_name || p.seller?.name || ''
            );
        });
        items.forEach((item) => {
          if (!item.seller_name && sellerMap.has(item.product_id)) {
            item.seller_name = sellerMap.get(item.product_id) || '';
          }
        });
      }

      setAvailableItems(items);
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
      setAvailableItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 내 리뷰 불러오기
  const loadMyReviews = async () => {
    setLoading(true);
    try {
      const reviews = await fetchMyReviews();

      // seller_name이 없는 리뷰는 상품 정보에서 가져오기
      const missingIds = [
        ...new Set(
          reviews
            .filter((r: ReviewItem) => !r.product?.seller_name)
            .map((r: ReviewItem) => r.product?._id)
            .filter(Boolean)
        ),
      ] as number[];
      if (missingIds.length > 0) {
        const productDetails = await Promise.all(
          missingIds.map((id) => fetchProduct(id).catch(() => null))
        );
        const sellerMap = new Map<number, string>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productDetails.forEach((p: any, idx: number) => {
          if (p)
            sellerMap.set(
              missingIds[idx],
              p.seller_name || p.seller?.name || ''
            );
        });
        reviews.forEach((r: ReviewItem) => {
          if (
            !r.product?.seller_name &&
            r.product?._id &&
            sellerMap.has(r.product._id)
          ) {
            r.product.seller_name = sellerMap.get(r.product._id) || '';
          }
        });
      }

      setMyReviews(reviews);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
      setMyReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 삭제
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteReview(deleteTargetId);
      setMyReviews((prev) => prev.filter((r) => r._id !== deleteTargetId));
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'available') {
      loadAvailableReviews();
    } else {
      loadMyReviews();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-[80px]">
        <Header title="리뷰관리" showBackButton showSearch showCart />
      </div>

      {/* 탭 */}
      <div className="px-5 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors border ${
              activeTab === 'available'
                ? 'bg-eatda-orange text-white border-eatda-orange'
                : 'bg-gray-200 text-gray-900 border-gray-300'
            }`}
          >
            작성 가능한 리뷰
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors border ${
              activeTab === 'my'
                ? 'bg-eatda-orange text-white border-eatda-orange'
                : 'bg-gray-200 text-gray-900 border-gray-300'
            }`}
          >
            내 리뷰
          </button>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div>
        {loading ? (
          <ReviewCardListSkeleton />
        ) : activeTab === 'available' ? (
          // 작성 가능한 리뷰 탭
          <div>
            {availableItems.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-sm">
                  작성 가능한 리뷰가 없습니다.
                </p>
              </div>
            ) : (
              availableItems.map((item) => (
                <div
                  key={`${item.order_id}-${item.product_id}`}
                  className="px-5 py-4"
                >
                  <div className="flex gap-4 mb-5">
                    {item.image_path ? (
                      <Image
                        src={getImageUrl(item.image_path)}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-md flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-eatda-orange">
                        {item.seller_name} 주부
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.purchase_date} 구매완료
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(
                        `/review/write?order_id=${item.order_id}&product_id=${item.product_id}`
                      )
                    }
                    className="w-full py-3 bg-eatda-orange text-white font-medium rounded-md"
                  >
                    리뷰 쓰기
                  </button>
                  <div className="border-b border-gray-300 mt-4"></div>
                </div>
              ))
            )}
          </div>
        ) : (
          // 내 리뷰 탭
          <div>
            {myReviews.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-sm">작성한 리뷰가 없습니다.</p>
              </div>
            ) : (
              myReviews.map((review) => (
                <div key={review._id} className="px-5 py-4">
                  <div className="flex gap-4 mb-5">
                    {review.extra?.images && review.extra.images.length > 0 ? (
                      <img
                        src={getImageUrl(review.extra.images[0].path)}
                        alt="리뷰 이미지"
                        className="w-16 h-16 rounded-md flex-shrink-0 object-cover"
                      />
                    ) : review.product?.image?.path ? (
                      <Image
                        src={getImageUrl(review.product.image.path)}
                        alt={review.product.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-md flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {review.product?.name || '상품명 없음'}
                      </h3>
                      <p className="text-sm text-eatda-orange">
                        {review.product?.seller_name
                          ? `${review.product.seller_name} 주부`
                          : ''}
                      </p>

                      {/* 별점 */}
                      <div className="py-1">
                        <StarItem
                          rating={review.rating}
                          onRatingChange={() => {}}
                          size={16}
                          editable={false}
                        />
                      </div>

                      {/* 리뷰 내용 */}
                      <p className="text-sm text-gray-900">{review.content}</p>
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <GrayButton
                        text="수정하기"
                        onClick={() =>
                          router.push(`/review/edit?reply_id=${review._id}`)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <GrayButton
                        text="삭제하기"
                        onClick={() => setDeleteTargetId(review._id)}
                      />
                    </div>
                  </div>
                  <div className="border-b border-gray-300 mt-4"></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="리뷰를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
