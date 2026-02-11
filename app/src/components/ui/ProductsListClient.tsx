'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CategoryTabs, {
  CategoryLabel,
} from '@/app/products/components/CategoryTabs';
import ProductCard from '@/app/src/components/ui/ProductCard';
import { Product } from '@/app/src/types';
import { getTier } from '@/lib/tier';
import { getAxios, getAccessToken } from '@/lib/axios';
import useKitchenStore from '@/zustand/kitchenStore';

type SortOption = 'recommend' | 'rating' | 'purchase' | 'latest';

const sortLabels: Record<SortOption, string> = {
  recommend: '추천순',
  rating: '별점순',
  purchase: '구매순',
  latest: '최신순',
};

const labelToKey: Record<Exclude<CategoryLabel, '전체'>, string> = {
  메인반찬: 'main',
  국물: 'soup',
  찜: 'steam',
  볶음: 'stir',
  조림: 'braise',
  튀김: 'fry',
  밑반찬: 'side',
};

function matchesCategory(product: Product, selected: CategoryLabel) {
  if (selected === '전체') return true;

  const key = labelToKey[selected];
  const keys = product.extra?.category ?? [];
  const label = product.extra?.categoryLabel ?? '';

  return keys.includes(key) || label === selected;
}

interface ProductsListClientProps {
  products: Product[];
}

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    case 'purchase':
      return sorted.sort((a, b) => (b.buyQuantity ?? 0) - (a.buyQuantity ?? 0));

    case 'latest':
      return sorted.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return b._id - a._id;
      });

    case 'recommend':
    default:
      return sorted.sort((a, b) => {
        const maxRating = 5;
        const maxPurchase = Math.max(
          ...sorted.map((p) => p.buyQuantity ?? 0),
          1
        );

        const scoreA =
          ((a.rating ?? 0) / maxRating) * 0.5 +
          ((a.buyQuantity ?? 0) / maxPurchase) * 0.5;
        const scoreB =
          ((b.rating ?? 0) / maxRating) * 0.5 +
          ((b.buyQuantity ?? 0) / maxPurchase) * 0.5;

        return scoreB - scoreA;
      });
  }
}

export default function ProductsListClient({
  products: initialProducts,
}: ProductsListClientProps) {
  const nearestKitchen = useKitchenStore((state) => state.nearestKitchen);
  const [selected, setSelected] = useState<CategoryLabel>('전체');
  const [sortBy, setSortBy] = useState<SortOption>('recommend');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!getAccessToken()) {
        setProducts(initialProducts);
        return;
      }

      try {
        const axios = getAxios();
        const bookmarksRes = await axios.get('/bookmarks/product');
        const bookmarks = bookmarksRes.data.item || [];

        const productsWithBookmarks = initialProducts.map((product) => {
          const bookmark = bookmarks.find((b: any) => {
            const targetId = b.product?._id ?? b.target_id ?? b.productId;
            return targetId === product._id;
          });

          return {
            ...product,
            myBookmarkId: bookmark?._id,
          };
        });

        setProducts(productsWithBookmarks);
      } catch (error) {
        console.error('북마크 조회 실패:', error);
        setProducts(initialProducts);
      }
    };

    fetchBookmarks();
  }, [initialProducts]);

  const handleBookmarkChange = async () => {
    try {
      const axios = getAxios();
      const bookmarksRes = await axios.get('/bookmarks/product');
      const bookmarks = bookmarksRes.data.item || [];

      const productsWithBookmarks = products.map((product) => {
        const bookmark = bookmarks.find((b: any) => {
          const targetId = b.product?._id ?? b.target_id ?? b.productId;
          return targetId === product._id;
        });

        return {
          ...product,
          myBookmarkId: bookmark?._id,
        };
      });

      setProducts(productsWithBookmarks);
    } catch (error) {
      console.error('북마크 재조회 실패:', error);
    }
  };
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const filtered = useMemo(() => {
    const kitchenFiltered = products.filter(
      (p) => p.extra?.pickupPlace === nearestKitchen
    );
    const categoryFiltered = kitchenFiltered.filter((p) =>
      matchesCategory(p, selected)
    );
    return sortProducts(categoryFiltered, sortBy);
  }, [products, selected, sortBy, nearestKitchen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <CategoryTabs value={selected} onChange={setSelected} />

      <div
        className={`fixed top-28 z-15 left-0 right-0 max-w-186 mx-auto flex justify-end pr-3 pointer-events-none transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-20'
        }`}
      >
        <div className="relative pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center gap-1 pl-3 pr-2 py-1.5 text-paragraph border border-gray-200 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
          >
            {sortLabels[sortBy]}
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`absolute top-full right-1 mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 origin-top ${
              isDropdownOpen
                ? 'opacity-100 scale-y-100'
                : 'opacity-0 scale-y-0 pointer-events-none'
            }`}
          >
            {(Object.keys(sortLabels) as SortOption[])
              .filter((option) => option !== sortBy)
              .map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-paragraph text-gray-800 hover:bg-gray-100 text-left whitespace-nowrap"
                >
                  {sortLabels[option]}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-25 mb-16 grid grid-cols-2 sm:mx-5 sm:mt-31 sm:grid-cols-3 sm:gap-2">
        {filtered.map((product, index) => (
          <ProductCard
            key={product._id}
            productId={product._id}
            imageSrc={product.mainImages?.[0]?.path ?? '/food1.png'}
            chefName={`${product.seller?.name ?? '주부'}`}
            tier={getTier(product.seller?.totalSales ?? 0).label}
            dishName={product.name}
            rating={product.rating ?? 0}
            reviewCount={
              typeof product.replies === 'number'
                ? product.replies
                : (product.replies?.length ?? 0)
            }
            price={product.price}
            initialWished={Boolean(product.myBookmarkId)}
            isLcp={index === 0}
            onBookmarkChange={handleBookmarkChange}
          />
        ))}
      </div>
    </>
  );
}
