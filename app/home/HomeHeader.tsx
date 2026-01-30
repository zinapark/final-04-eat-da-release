'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getAxios } from '@/lib/axios';
import ProductCard from '@/app/src/components/ui/ProductCard';
import { Product } from '@/app/src/types';

interface HomeHeaderProps {
  onSearch?: () => void;
  onCart?: () => void;
}

export default function HomeHeader({ onSearch, onCart }: HomeHeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    router.push('/home');
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCart = () => {
    if (onCart) {
      onCart();
    } else {
      router.push('/cart');
    }
  };

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
        const matchedProducts = products.filter((product: Product) =>
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

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white px-5 py-5 z-50">
        {!isSearchOpen ? (
          <div className="flex items-center justify-between">
            <button onClick={handleLogoClick} aria-label="홈으로 이동">
              <svg
                width="54"
                height="23"
                viewBox="0 0 54 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.9521 0.0482302H18.1441V14.8082H14.9521V0.0482302ZM8.9761 13.7282H11.6641V14.1362C11.6641 15.1442 11.4721 16.0882 11.0881 16.9682C10.7201 17.8482 10.1761 18.6402 9.4561 19.3442C8.7521 20.0482 7.8721 20.6402 6.8161 21.1202C5.7601 21.6162 4.5521 21.9682 3.1921 22.1762L1.9921 19.7042C3.1761 19.5282 4.2001 19.2562 5.0641 18.8882C5.9441 18.5202 6.6721 18.0882 7.2481 17.5922C7.8241 17.0802 8.2561 16.5282 8.5441 15.9362C8.8321 15.3442 8.9761 14.7442 8.9761 14.1362V13.7282ZM9.5521 13.7282H12.2641V14.1362C12.2641 14.7442 12.4081 15.3442 12.6961 15.9362C12.9841 16.5282 13.4081 17.0802 13.9681 17.5922C14.5441 18.0882 15.2641 18.5202 16.1281 18.8882C17.0081 19.2562 18.0401 19.5282 19.2241 19.7042L18.0241 22.1762C16.6641 21.9682 15.4561 21.6162 14.4001 21.1202C13.3441 20.6402 12.4561 20.0482 11.7361 19.3442C11.0321 18.6402 10.4881 17.8482 10.1041 16.9682C9.7361 16.0722 9.5521 15.1282 9.5521 14.1362V13.7282ZM6.0481 1.39223C7.2001 1.39223 8.2321 1.62423 9.1441 2.08823C10.0561 2.55223 10.7761 3.19223 11.3041 4.00823C11.8321 4.82423 12.0961 5.76823 12.0961 6.84023C12.0961 7.89623 11.8321 8.83223 11.3041 9.64823C10.7761 10.4642 10.0561 11.1122 9.1441 11.5922C8.2321 12.0562 7.2001 12.2882 6.0481 12.2882C4.9121 12.2882 3.8801 12.0562 2.9521 11.5922C2.0401 11.1122 1.3201 10.4642 0.792102 9.64823C0.264102 8.83223 0.000101596 7.89623 0.000101596 6.84023C0.000101596 5.76823 0.264102 4.82423 0.792102 4.00823C1.3201 3.19223 2.0401 2.55223 2.9521 2.08823C3.8801 1.62423 4.9121 1.39223 6.0481 1.39223ZM6.0481 4.08023C5.5041 4.08023 5.0081 4.19223 4.5601 4.41623C4.1121 4.62423 3.7601 4.93623 3.5041 5.35223C3.2481 5.75223 3.1201 6.24823 3.1201 6.84023C3.1201 7.41623 3.2481 7.91223 3.5041 8.32823C3.7601 8.72823 4.1121 9.04023 4.5601 9.26423C5.0081 9.48823 5.5041 9.60023 6.0481 9.60023C6.6081 9.60023 7.1041 9.48823 7.5361 9.26423C7.9841 9.04023 8.3361 8.72823 8.5921 8.32823C8.8481 7.91223 8.9761 7.41623 8.9761 6.84023C8.9761 6.24823 8.8481 5.75223 8.5921 5.35223C8.3361 4.93623 7.9841 4.62423 7.5361 4.41623C7.1041 4.19223 6.6081 4.08023 6.0481 4.08023ZM30.3021 11.5965V14.1362H22.4442V11.5965H30.3021ZM47.1299 0.000229359H50.3459V22.2962H47.1299V0.000229359ZM49.6499 8.23223H53.5619V10.8722H49.6499V8.23223ZM33.7859 14.3282H35.6579C36.9219 14.3282 38.1059 14.3122 39.2099 14.2802C40.3139 14.2322 41.3859 14.1602 42.4259 14.0642C43.4659 13.9522 44.5299 13.8002 45.6179 13.6082L45.9299 16.2482C44.8099 16.4402 43.7059 16.5922 42.6179 16.7042C41.5459 16.8162 40.4419 16.8882 39.3059 16.9202C38.1699 16.9522 36.9539 16.9682 35.6579 16.9682H33.7859V14.3282ZM33.7859 2.06423H44.1539V4.63223H36.9779V15.5762H33.7859V2.06423Z"
                  fill="#FF6155"
                />
              </svg>
            </button>

            <div className="flex gap-4 items-center">
              <button onClick={handleSearch} className="text-gray-900">
                <img src="/search.svg" alt="검색" width={21} height={21} />
              </button>
              <button onClick={handleCart} className="text-gray-900 relative">
                <img
                  src="/shopping cart.svg"
                  alt="장바구니"
                  width={22}
                  height={22}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseSearch}
              className="text-gray-900"
              aria-label="검색 닫기"
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
                className="flex-1 bg-transparent outline-none text-paragraph placeholder:text-gray-500"
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
        )}
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 overflow-y-auto">
          <div className="pb-20">
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
                <p className="text-paragraph font-semibold mb-4 px-5">
                  검색 결과 {searchResults.length}개
                </p>
                <div className="grid grid-cols-2">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product._id}
                      productId={product._id}
                      imageSrc={product.mainImages?.[0]?.path ?? '/food1.png'}
                      chefName={`${product.seller?.name ?? '주부'}`}
                      dishName={product.name}
                      rating={product.rating ?? 0}
                      reviewCount={product.replies ?? 0}
                      price={product.price}
                      initialWished={Boolean(product.myBookmarkId)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
