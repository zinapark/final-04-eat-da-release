'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SellerCard from '@/app/sellers/components/SellerCard';
import useKitchenStore from '@/zustand/kitchenStore';
import { getImageUrl } from '@/lib/review';

type SortOption = 'recommend' | 'rating' | 'review' | 'product';

const sortLabels: Record<SortOption, string> = {
  recommend: '추천순',
  rating: '별점순',
  review: '리뷰순',
  product: '구매순',
};

interface SellerCardData {
  sellerId: number;
  seller: {
    name?: string;
    image?: string | { path?: string };
    extra?: {
      introduction?: string;
      intro?: string;
      profileImage?: string;
    };
  };
  topDishes: { imageSrc: string; name: string }[];
  rating: number;
  reviewCount: number;
  productCount: number;
  tier: string;
  kitchens: string[];
}

interface SellersListClientProps {
  sellerCards: SellerCardData[];
}

function sortSellers(
  sellers: SellerCardData[],
  sortBy: SortOption
): SellerCardData[] {
  const sorted = [...sellers];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'review':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);

    case 'product':
      return sorted.sort((a, b) => b.productCount - a.productCount);

    case 'recommend':
    default:
      return sorted.sort((a, b) => {
        const maxRating = 5;
        const maxReview = Math.max(...sorted.map((s) => s.reviewCount), 1);

        const scoreA =
          (a.rating / maxRating) * 0.5 + (a.reviewCount / maxReview) * 0.5;
        const scoreB =
          (b.rating / maxRating) * 0.5 + (b.reviewCount / maxReview) * 0.5;

        return scoreB - scoreA;
      });
  }
}

export default function SellersListClient({
  sellerCards,
}: SellersListClientProps) {
  const nearestKitchen = useKitchenStore((state) => state.nearestKitchen);
  const [sortBy, setSortBy] = useState<SortOption>('recommend');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const sortedSellers = useMemo(() => {
    const kitchenFiltered = sellerCards.filter((card) =>
      card.kitchens.includes(nearestKitchen)
    );
    return sortSellers(kitchenFiltered, sortBy);
  }, [sellerCards, sortBy, nearestKitchen]);

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
      <div
        className={`fixed top-20 z-10 left-0 right-0 max-w-186 mx-auto flex justify-end pr-3 pointer-events-none transition-transform duration-300 ${
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

      <div className="mt-14 mb-16 max-w-186 mx-auto">
        {sortedSellers.map((card, index) => {
          const isLast = index === sortedSellers.length - 1;
          const sellerName = card.seller.name ?? '주부';
          const sellerDescription =
            card.seller.extra?.introduction ??
            card.seller.extra?.intro ??
            '정성스럽게 만든 집밥을 나눕니다.';
          const sellerProfileImage =
            card.seller.extra?.profileImage ??
            (typeof card.seller.image === 'string'
              ? card.seller.image
              : card.seller.image?.path
                ? getImageUrl(card.seller.image.path)
                : '/seller/seller1.png');

          return (
            <SellerCard
              key={card.sellerId}
              sellerId={card.sellerId}
              sellerName={sellerName}
              tier={card.tier}
              rating={card.rating}
              reviewCount={card.reviewCount}
              profileImage={sellerProfileImage}
              description={sellerDescription}
              topDishes={card.topDishes}
              showDivider={!isLast}
            />
          );
        })}
      </div>
    </>
  );
}
