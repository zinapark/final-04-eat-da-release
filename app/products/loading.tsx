import Header from '@/app/src/components/common/Header';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';

function CategoryTabsSkeleton() {
  return (
    <div className="fixed top-15 z-20 bg-white shadow-[inset_0_-0.5px_0_0_rgb(209,213,219)] flex h-10 w-full max-w-186 min-[464px]:gap-0 overflow-x-auto min-[464px]:px-0 scrollbar-hide text-paragraph">
      {['전체', '메인반찬', '국물', '찜', '볶음', '조림', '튀김', '밑반찬'].map(
        (category) => (
          <span
            key={category}
            className="h-full shrink-0 w-16 min-[464px]:w-auto min-[464px]:shrink min-[464px]:flex-1 flex items-center justify-center font-medium text-gray-400"
          >
            {category}
          </span>
        )
      )}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-gray-200" />
      <div className="pt-4 pb-5 px-2.5 space-y-1">
        <div className="flex gap-2 items-center">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 bg-gray-200 rounded w-2/5" />
          <div className="h-3 bg-gray-200 rounded w-1/5" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title=" " showBackButton showSearch showCart />

      <CategoryTabsSkeleton />

      <div className="fixed top-28 z-15 flex place-self-end mr-3">
        <div className="h-8 w-18 bg-gray-200 rounded-full animate-pulse" />
      </div>

      <div className="mt-25 mb-16 grid grid-cols-2 sm:grid-cols-3 sm:gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

      <BottomNavigation />
    </>
  );
}
