"use client";

import ProductCard from "@/app/src/components/ui/ProductCard";
import Header from "@/app/src/components/common/Header";
import BottomNavigation from "@/app/src/components/common/BottomNavigation";
import { getAxios } from "@/lib/axios";
import { useEffect, useState } from "react";
import { BookmarkProduct } from "@/app/src/types";

export default function WishlistPageClient() {
  const [bookmarks, setBookmarks] = useState<BookmarkProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const axios = getAxios();
      const response = await axios.get("/bookmarks/product");
      setBookmarks(response.data.item || []);
    } catch (error) {
      console.error("북마크 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkDeleted = () => {
    fetchBookmarks();
  };

  return (
    <>
      <Header
        title="위시리스트"
        showBackButton={true}
        showSearch={true}
        showCart={true}
      />
      <div className="mt-15 mb-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600">찜한 상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {bookmarks.map((bookmark) => (
              <ProductCard
                key={bookmark._id}
                productId={bookmark.product._id}
                imageSrc={
                  bookmark.product.mainImages?.[0]?.path || "/food1.png"
                }
                chefName={bookmark.product.seller?.name || "주부"}
                dishName={bookmark.product.name}
                rating={bookmark.product.extra?.rating || 0}
                reviewCount={bookmark.product.extra?.replies || 0}
                price={bookmark.product.price}
                initialWished={true}
                bookmarkId={bookmark._id}
                onBookmarkChange={handleBookmarkDeleted}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </>
  );
}
