import SellerCard from "@/app/sellers/components/SellerCard";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import BottomNavigation from "@/app/src/components/common/BottomNavigation";
import Header from "@/app/src/components/common/Header";

const sellers = [
  { id: "s1" },
  { id: "s2" },
  { id: "s3" },
  { id: "s4" },
  { id: "s5" },
  { id: "s6" },
];

export default function SellersList() {
  {
    /* 리뷰 리스트 */
  }
  const reviews = [{ id: "r1" }, { id: "r2" }, { id: "r3" }];

  return (
    <div className="flex flex-col gap-7.5 mt-15 pb-23">
      <Header title="주부 목록" showBackButton showSearch showCart />
      <div>
        {sellers.map((seller, index) => {
          const isLast = index === sellers.length - 1;

          return <SellerCard key={seller.id} showDivider={!isLast} />;
        })}
      </div>

      <BottomNavigation />
    </div>
  );
}
