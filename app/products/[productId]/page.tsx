import IngredientList from "@/app/products/[productId]/components/IngredientList";
import ProductImageSlider from "@/app/products/[productId]/components/ProductImageSlider";
import HeartItem from "@/app/src/components/ui/HeartItem";
import ReviewItem from "@/app/src/components/ui/ReviewItem";
import SellerProfileCard from "@/app/src/components/ui/SellerProfileCard";
import ReviewList from "@/app/src/components/ui/ReviewList";
import Header from "@/app/src/components/common/Header";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import ProductDetailClient from "@/app/products/[productId]/ProductDetailClient";
import { getAxios } from "@/lib/axios";

async function getProduct(productId: string) {
  const axios = getAxios();
  const res = await axios.get(`/products/${productId}/`);
  return res.data;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  console.log("detail productId:", productId);

  const data = await getProduct(productId);
  const product = data.item;
  const extra = product.extra ?? {};
  const ingredients: string[] = extra.ingredients ?? [];
  const serving: string = extra.serving ?? "2인분";
  const pickupPlace: string = extra.pickupPlace ?? "서교동 공유주방";
  const stock: number = product.quantity ?? 0;

  {
    /* 반찬 이미지 */
  }
  const productImages = product.mainImages?.map(
    (img: { path: string }) => img.path
  ) ?? ["/food/food_01.png"];

  {
    /* 리뷰 리스트 */
  }
  const reviews = product.replies ?? [];

  {
    /* 판매자 정보 */
  }
  const seller = product.seller ?? {};
  const sellerName: string = seller.name ?? "주부";
  const sellerDescription: string = seller.extra?.description;
  const rating: number = product.rating ?? 0;
  const reviewCount: number = reviews.length;

  return (
    <main className="flex flex-col mt-12.5 gap-5 pb-23">
      {/* 헤더 */}
      <Header title=" " showBackButton showSearch showCart />
      {/* 상품 정보 */}
      <ProductImageSlider images={productImages} />
      {/* 반찬이름 */}
      <div className="flex mx-5 items-center ">
        <h1 className=" w-full text-display-7 font-semibold">{product.name}</h1>
        <HeartItem size={24} />
      </div>
      {/* 주부 소개 */}
      <SellerProfileCard
        name={sellerName}
        rating={rating}
        reviewCount={reviewCount}
        description={sellerDescription}
      />
      {/* 메뉴 정보 */}
      <div className=" flex flex-col px-5 gap-4">
        <div className=" flex flex-col gap-1">
          <h5 className="text-paragraph">메뉴 소개</h5>
          <div
            className="text-paragraph text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.content ?? "" }}
          />
        </div>
        {/* 재료 */}
        <div className=" flex flex-col gap-1 pb-5 border-b-[0.5px] border-gray-400">
          <h5 className="text-paragraph mb-1">재료</h5>
          <IngredientList ingredients={ingredients} />
        </div>
        {/* n인분 */}
        <div className="flex justify-between border-b-[0.5px] border-gray-400 pb-4">
          <h5 className="text-paragraph">인분</h5>
          <p className="text-paragraph">{serving}</p>
        </div>
        {/* 픽업장소&남은수량 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between ">
            <h5 className="text-paragraph">픽업장소</h5>
            <p className="text-paragraph">{pickupPlace}</p>
          </div>
          <div className="flex justify-between border-b-[0.5px] border-gray-400 pb-4">
            <h5 className="text-paragraph">남은 수량</h5>
            <p className="text-paragraph">{stock}개</p>
          </div>
        </div>
      </div>
      {/* 리뷰 */}
      <div className="gap-0">
        <ReviewList reviews={reviews} />
      </div>

      <ProductDetailClient product={product} />
    </main>
  );
}
