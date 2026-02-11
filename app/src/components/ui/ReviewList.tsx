'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReviewItem from '@/app/src/components/ui/ReviewItem';

const INITIAL_REVIEW_COUNT = 3;

type SortOption = 'recommend' | 'ratingHigh' | 'ratingLow' | 'latest';

const sortLabels: Record<SortOption, string> = {
  recommend: '추천순',
  ratingHigh: '별점 높은순',
  ratingLow: '별점 낮은순',
  latest: '최신순',
};

export interface Review {
  id?: string;
  _id?: number;
  userId?: number;
  userName?: string;
  profileImage?: string;
  rating?: number;
  createdAt?: string;
  productName?: string;
  content?: string;
  images?: string[];
  user?: {
    _id?: number;
    name?: string;
    image?: string;
  };
  product?: {
    name?: string;
    image?: {
      path?: string;
      name?: string;
    };
  };
  extra?: {
    images?: string[];
  };
}

interface ReviewListProps {
  reviews: Review[];
}

interface ResolvedReview extends Review {
  id: string;
  userName: string;
  profileImage?: string;
  productName: string;
  images: string[];
}

function sortReviews(
  reviews: ResolvedReview[],
  sortBy: SortOption
): ResolvedReview[] {
  const sorted = [...reviews];

  switch (sortBy) {
    case 'ratingHigh':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    case 'ratingLow':
      return sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));

    case 'latest':
      return sorted.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return (b._id ?? 0) - (a._id ?? 0);
      });

    case 'recommend':
    default:
      return sorted.sort((a, b) => {
        const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.content?.length ?? 0) - (a.content?.length ?? 0);
      });
  }
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommend');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    } else {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const sortedReviews = useMemo(() => {
    const resolved = reviews.map((review, index) => {
      const resolvedId = review.id ?? String(review._id ?? index);
      const resolvedUserName = review.userName ?? review.user?.name ?? '익명';
      const resolvedProfileImage = review.profileImage ?? review.user?.image;
      const resolvedProductName =
        review.productName ?? review.product?.name ?? '';
      const resolvedImages =
        review.images ??
        review.extra?.images ??
        (review.product?.image?.path ? [review.product.image.path] : []);

      return {
        ...review,
        id: resolvedId,
        userName: resolvedUserName,
        profileImage: resolvedProfileImage,
        productName: resolvedProductName,
        images: resolvedImages,
      };
    });

    return sortReviews(resolved, sortBy);
  }, [reviews, sortBy]);

  const displayedReviews = isExpanded
    ? sortedReviews
    : sortedReviews.slice(0, INITIAL_REVIEW_COUNT);

  const hasMoreReviews = sortedReviews.length > INITIAL_REVIEW_COUNT;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="review-title"
      className="gap-0 scroll-mt-14"
    >
      <div className="flex justify-between items-center mx-5">
        <h3 id="review-title" className="text-display-4 font-semibold">
          리뷰 ({sortedReviews.length})
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center gap-1 text-paragraph text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
            >
              {sortLabels[sortBy]}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
              className={`absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden z-10 transition-all duration-200 origin-top ${
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
          {hasMoreReviews && (
            <button
              type="button"
              onClick={handleToggle}
              className="text-paragraph text-gray-700"
            >
              {isExpanded ? '접기' : '더보기'}
            </button>
          )}
        </div>
      </div>

      <ul>
        {displayedReviews.map((review, index) => {
          const isLast = index === displayedReviews.length - 1;

          return (
            <li key={review.id ?? review._id ?? index}>
              <ReviewItem
                showDivider={!isLast}
                userName={review.userName}
                profileImage={review.profileImage}
                rating={review.rating}
                createdAt={review.createdAt}
                productName={review.productName}
                content={review.content}
                images={review.images}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
