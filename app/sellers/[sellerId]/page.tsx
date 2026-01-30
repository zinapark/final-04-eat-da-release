import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import Header from "@/app/src/components/common/Header";
import ProductCard from "@/app/src/components/ui/ProductCard";
import ReviewList from "@/app/src/components/ui/ReviewList";
import SellerProfileCard from "@/app/src/components/ui/SellerProfileCard";

export default function SellersDeatailPage() {
  {
    /* 리뷰 리스트 */
  }
  const reviews = [{ id: "r1" }, { id: "r2" }, { id: "r3" }];

  return (
    <div className="flex flex-col gap-7.5 mt-15 pt-7.5 pb-23">
      <Header title="김미숙 주부9단" showBackButton showSearch showCart />
      <SellerProfileCard />
      {/* 반찬 리스트 */}
      <div className="grid grid-cols-2">
        <ProductCard
          imageSrc="/food2.png"
          chefName="김미숙 주부9단"
          dishName="얼큰한 김치찌개"
          rating={4.9}
          reviewCount={13}
          price={8500}
          initialWished={true}
        />
        <ProductCard
          imageSrc="/food1.png"
          chefName="박영희 주부8단"
          dishName="소고기 장조림"
          rating={4.8}
          reviewCount={25}
          price={12000}
          initialWished={false}
        />
        <ProductCard
          imageSrc="/food2.png"
          chefName="김미숙 주부9단"
          dishName="얼큰한 김치찌개"
          rating={4.9}
          reviewCount={13}
          price={8500}
          initialWished={true}
        />
        <ProductCard
          imageSrc="/food1.png"
          chefName="박영희 주부8단"
          dishName="소고기 장조림"
          rating={4.8}
          reviewCount={25}
          price={12000}
          initialWished={false}
        />
        <ProductCard
          imageSrc="/food2.png"
          chefName="김미숙 주부9단"
          dishName="얼큰한 김치찌개"
          rating={4.9}
          reviewCount={13}
          price={8500}
          initialWished={true}
        />
        <ProductCard
          imageSrc="/food1.png"
          chefName="박영희 주부8단"
          dishName="소고기 장조림"
          rating={4.8}
          reviewCount={25}
          price={12000}
          initialWished={false}
        />
      </div>
      {/* 리뷰 */}
      <div className="gap-0">
        <ReviewList reviews={reviews} />
      </div>

      <BottomFixedButton as="link" href={`/mypage/${"subscription"}`}>
        구독하기
      </BottomFixedButton>
    </div>
  );
}
