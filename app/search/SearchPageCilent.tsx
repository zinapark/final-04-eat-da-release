'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAxios } from '@/lib/axios';
import ProductCard from '@/app/src/components/ui/ProductCard';
import { Product } from '@/app/src/types';

export default function SearchPageCilent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchData = async () => {
      setIsLoading(true);
      const axios = getAxios();

      try {
        const productResponse = await axios.get('/products');
        const products = productResponse.data.item || [];
        // 구독권 제외 후 검색어 필터링
        const matchedProducts = products.filter(
          (product: Product) =>
            !product.extra?.isSubscription &&
            product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(matchedProducts);
      } catch (error) {
        console.error('검색 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="w-full max-w-[744px] mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-900"
              aria-label="뒤로가기"
            >
              <img src="/back.svg" alt="뒤로가기" width={10} height={18} />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5">
              <img src="/search.svg" alt="검색" width={16} height={16} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="반찬 이름을 검색하세요"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-500"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 4L4 12M4 4l8 8" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[744px] min-w-[390px] mx-auto px-4 sm:px-6">
        <div className="pt-19 pb-20">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">검색 중...</p>
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">검색 결과가 없습니다</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <p className="text-paragraph font-semibold mb-4 px-5 pt-3">
                검색 결과 {searchResults.length}개
              </p>
              <div className="grid grid-cols-2 gap-x-0 sm:grid-cols-3 sm:gap-2.5">
                {searchResults.map((product) => {
                  const reviewCount = Array.isArray(product.replies)
                    ? product.replies.length
                    : typeof product.replies === 'number'
                      ? product.replies
                      : 0;

                  return (
                    <ProductCard
                      key={product._id}
                      productId={product._id}
                      imageSrc={product.mainImages?.[0]?.path ?? '/food1.png'}
                      chefName={`${product.seller?.name ?? '주부'}`}
                      dishName={product.name}
                      rating={product.rating ?? 0}
                      reviewCount={reviewCount}
                      price={product.price}
                      initialWished={Boolean(product.myBookmarkId)}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>반찬 이름을 검색해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
