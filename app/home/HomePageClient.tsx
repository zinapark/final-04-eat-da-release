"use client";

import HomeHeader from "@/app/home/HomeHeader";
import RecommendProduct from "@/app/home/RecommendProduct";
import BottomNavigation from "@/app/src/components/common/BottomNavigation";
import SellerProfileClear from "@/app/src/components/ui/SellerProfileClear";
import ProductCard from "@/app/src/components/ui/ProductCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAxios } from "@/lib/axios";
import { Product } from "@/app/src/types";

export default function HomePageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const axios = getAxios();
        const response = await axios.get("/products");
        setProducts(response.data.item || []);
      } catch (error) {
        console.error("상품 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HomeHeader />
      <div className="p-5 flex flex-col gap-6 mt-12 mb-10">
        <Image src="/Hero.png" alt="banner" height={460} width={350}></Image>
        <div>
          <p className="text-display-5 font-semibold pb-4">오늘의 추천 반찬</p>
          <div className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            <RecommendProduct />
            <RecommendProduct />
            <RecommendProduct />
            <RecommendProduct />
          </div>
        </div>
        <div className="border-b-[0.5px] border-gray-400 pb-4">
          <p className="text-display-5 font-semibold pb-4">
            오늘의 추천 주부님
          </p>
          <div className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            <div className="shrink-0 w-28">
              <Image
                src="/food2.png"
                alt="음식"
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
            <div className="shrink-0 w-28">
              <Image
                src="/food2.png"
                alt="음식"
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
            <div className="shrink-0 w-28">
              <Image
                src="/food2.png"
                alt="음식"
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
            <div className="shrink-0 w-28">
              <Image
                src="/food2.png"
                alt="음식"
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
          </div>
          <SellerProfileClear />
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 -mx-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                imageSrc={product.mainImages?.[0]?.path ?? "/food1.png"}
                chefName={`${product.seller?.name ?? "주부"}`}
                dishName={product.name}
                rating={product.rating ?? 0}
                reviewCount={product.replies ?? 0}
                price={product.price}
                initialWished={Boolean(product.myBookmarkId)}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </>
  );
}
