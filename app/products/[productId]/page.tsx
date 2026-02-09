'use client';

import { useEffect, useState } from 'react';
import IngredientList from '@/app/products/[productId]/components/IngredientList';
import ProductImageSlider from '@/app/products/[productId]/components/ProductImageSlider';
import HeartItem from '@/app/src/components/ui/HeartItem';
import SellerProfileCard from '@/app/src/components/ui/SellerProfileCard';
import ReviewList from '@/app/src/components/ui/ReviewList';
import Header from '@/app/src/components/common/Header';
import ProductDetailClient from '@/app/products/[productId]/ProductDetailClient';
import { getAxios } from '@/lib/axios';
import { getTier } from '@/lib/tier';
import { Product, Reply } from '@/app/src/types/product';
import { getImageUrl } from '@/lib/review';
import { ProductDetailSkeleton } from './loading';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Reply[]>([]);
  const [sellerProfileImage, setSellerProfileImage] = useState<
    string | undefined
  >();
  const [sellerTier, setSellerTier] = useState<
    { level: number; label: string } | undefined
  >();
  const [bookmarkId, setBookmarkId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    params.then(({ productId: id }) => {
      fetchProductData(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const fetchProductData = async (id: string) => {
    try {
      const axios = getAxios();

      // 1. 상품 정보만 먼저 호출 (bookmarks 호출 제거 - myBookmarkId 사용)
      const productRes = await axios.get(`/products/${id}/`);
      const productData = productRes.data.item;

      setProduct(productData);
      setBookmarkId(productData.myBookmarkId);

      const reviewsData: Reply[] = Array.isArray(productData.replies)
        ? productData.replies
        : [];
      setReviews(reviewsData);

      // 2. 셀러 정보 호출 (병렬로 처리)
      if (productData.seller?._id) {
        const sellerInfo = await getSellerInfo(productData.seller._id);
        setSellerProfileImage(sellerInfo.image);
        setSellerTier(sellerInfo.tier);
      }

      // 3. 리뷰어 이미지는 reply.user.image를 사용하므로 추가 API 호출 불필요
    } catch (error) {
      console.error('상품 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSellerInfo = async (
    sellerId: number
  ): Promise<{
    image: string | undefined;
    tier: { level: number; label: string };
  }> => {
    try {
      const axios = getAxios();

      // 개별 판매자 정보와 판매자 목록을 병렬로 호출
      const [sellerRes, usersRes] = await Promise.all([
        axios.get(`/users/${sellerId}`),
        axios.get('/users/'),
      ]);

      const seller = sellerRes.data.item;
      const users = usersRes.data.item || [];

      // 판매자 목록에서 totalSales 찾기
      const sellerFromList = users.find(
        (u: { _id?: number; seller_id?: number; totalSales?: number }) =>
          u._id === sellerId || u.seller_id === sellerId
      );
      const totalSales = sellerFromList?.totalSales ?? 0;

      return {
        image: seller?.extra?.profileImage ?? seller?.image,
        tier: getTier(totalSales),
      };
    } catch (error) {
      console.error('판매자 정보 조회 실패:', error);
      return { image: undefined, tier: getTier(0) };
    }
  };

  const handleWishToggle = async (newWishedState: boolean) => {
    try {
      const axios = getAxios();

      if (!newWishedState && bookmarkId) {
        await axios.delete(`/bookmarks/${bookmarkId}`);
        setBookmarkId(undefined);
      } else if (newWishedState) {
        try {
          const response = await axios.post('/bookmarks/product', {
            target_id: product!._id,
          });
          setBookmarkId(response.data.item._id);
        } catch (error: any) {
          if (error.response?.status === 422) {
            console.log('이미 북마크되어 있음 - 북마크 목록 재조회');
            const bookmarksRes = await axios.get('/bookmarks');
            const bookmarks = bookmarksRes.data.item || [];
            const existing = bookmarks.find((b: any) => {
              const targetId = b.product?._id ?? b.target_id ?? b.productId;
              return targetId === product!._id;
            });
            if (existing) {
              setBookmarkId(existing._id);
            }
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error);
    }
  };

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const extra = product.extra ?? {};
  const ingredients: string[] = extra.ingredients ?? [];
  const serving: string = `${extra.servings ?? 2}인분`;
  const pickupPlace: string = extra.pickupPlace ?? '서교동 공유주방';
  const stock: number = product.quantity ?? 0;
  const productImages = product.mainImages?.map(
    (img: { path: string }) => img.path
  ) ?? ['/food/food_01.png'];

  const seller = product.seller ?? {};
  const sellerName: string = seller.name ?? '주부';
  const sellerDescription: string =
    seller.extra?.description ?? seller.extra?.intro ?? '';
  const rating: number = product.rating ?? 0;
  const reviewCount: number = reviews.length;

  return (
    <main className="flex flex-col mt-12.5 gap-5 pb-23">
      <Header title=" " showBackButton showSearch showCart />
      <ProductImageSlider images={productImages} />

      {/* 반찬이름 */}
      <div className="flex mx-5 items-center">
        <h1 className="w-full text-display-7 font-semibold">{product.name}</h1>
        <HeartItem
          size={24}
          initialWished={Boolean(bookmarkId)}
          onToggle={handleWishToggle}
        />
      </div>

      <SellerProfileCard
        name={sellerName}
        tier={sellerTier?.label}
        rating={rating}
        reviewCount={reviewCount}
        profileImage={sellerProfileImage}
        description={sellerDescription}
        sellerId={product.seller?._id}
      />

      <div className="flex flex-col px-5 gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="text-paragraph">메뉴 소개</h5>
          <div
            className="text-paragraph text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.content ?? '' }}
          />
        </div>

        <div className="flex flex-col gap-1 pb-5 border-b-[0.5px] border-gray-400">
          <h5 className="text-paragraph mb-1">재료</h5>
          <IngredientList ingredients={ingredients} />
        </div>

        <div className="flex justify-between border-b-[0.5px] border-gray-400 pb-4">
          <h5 className="text-paragraph">인분</h5>
          <p className="text-paragraph">{serving}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h5 className="text-paragraph">픽업장소</h5>
            <p className="text-paragraph">{pickupPlace}</p>
          </div>
          <div className="flex justify-between border-b-[0.5px] border-gray-400 pb-4">
            <h5 className="text-paragraph">남은 수량</h5>
            <p className="text-paragraph">{stock}개</p>
          </div>
        </div>
      </div>

      <div className="gap-0">
        <ReviewList
          reviews={reviews.map((r: Reply) => ({
            id: String(r._id),
            userId: r.user?._id,
            userName: r.user?.name ?? '익명',
            profileImage: r.user?.image,
            rating: r.rating,
            createdAt: r.createdAt,
            content: r.content,
            images: (r.extra?.images ?? []).map((img: unknown) =>
              typeof img === 'string'
                ? img
                : getImageUrl((img as { path: string }).path)
            ),
          }))}
        />
      </div>

      <ProductDetailClient product={product} />
    </main>
  );
}
