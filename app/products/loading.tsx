import Header from '@/app/src/components/common/Header';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';

function CategoryTabsSkeleton() {
  return (
    <div className="fixed top-15 z-10 bg-white border-b-[0.5px] border-gray-300 flex h-10 w-full items-center gap-7.5 px-5">
      {['전체', '메인반찬', '국물', '찜', '볶음', '조림', '튀김', '밑반찬'].map(
        (category) => (
          <span
            key={category}
            className="shrink-0 text-paragraph font-medium text-gray-400"
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
      <div className="relative w-full aspect-square bg-gray-200" />
      <div className="pt-4 pb-5 px-2.5 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="서교동 공유주방" showBackButton showSearch showCart />

      <CategoryTabsSkeleton />

      <div className="mt-25 mb-16 grid grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

      <BottomNavigation />
    </>
  );
}
