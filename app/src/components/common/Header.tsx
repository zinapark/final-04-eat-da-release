'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getAxios } from '@/lib/axios';
import ProductCard from '@/app/src/components/ui/ProductCard';
import { Product } from '@/app/src/types';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showHome?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onSearch?: () => void;
  onCart?: () => void;
  onHome?: () => void;
}

export default function Header({
  title,
  showBackButton = false,
  showCloseButton = false,
  showSearch = false,
  showCart = false,
  showHome = false,
  onBack,
  onClose,
  onSearch,
  onCart,
  onHome,
}: HeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
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

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      router.push('/home');
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
      <header className="fixed top-0 left-0 right-0 bg-white px-4 pt-4 pb-3 z-50">
        {!isSearchOpen ? (
          <div className="flex items-center justify-between">
            {/* 왼쪽: 뒤로가기 + 제목 */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="text-gray-900"
                  aria-label="뒤로가기"
                >
                  <img src="/back.svg" alt="뒤로가기" width={10} height={18} />
                </button>
              )}
              <h1 className="text-display-6 font-semibold text-gray-900">
                {title}
              </h1>
            </div>

            {/* 오른쪽: X, 검색, 장바구니/홈 */}
            <div className="flex gap-4 items-center">
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="text-gray-900"
                  aria-label="닫기"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              {showSearch && (
                <button onClick={handleSearch} className="text-gray-900">
                  <img src="/search.svg" alt="검색" width={21} height={21} />
                </button>
              )}
              {showHome ? (
                <button onClick={handleHome} className="text-gray-900">
                  <img src="/Home.svg" alt="홈" width={21} height={21} />
                </button>
              ) : showCart ? (
                <button onClick={handleCart} className="text-gray-900 relative">
                  <img
                    src="/shopping cart.svg"
                    alt="장바구니"
                    width={22}
                    height={22}
                  />
                </button>
              ) : null}
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
        <div className="fixed inset-0 bg-white z-40 pt-19 overflow-y-auto">
          <div className=" pb-20">
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
                <div className="grid grid-cols-2 gap-x-0">
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
