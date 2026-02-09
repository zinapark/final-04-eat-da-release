import Header from '@/app/src/components/common/Header';

function TabSkeleton() {
  return (
    <div className="px-5 py-4">
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse" />
        <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="px-5 py-4 animate-pulse">
      <div className="flex gap-4 mb-5">
        <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-28" />
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded-md" />
      <div className="border-b border-gray-300 mt-4" />
    </div>
  );
}

export function ReviewCardListSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="mt-[80px]">
      <TabSkeleton />
      <ReviewCardListSkeleton />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pb-[80px]">
        <Header title="리뷰관리" showBackButton showSearch showCart />
      </div>
      <ReviewSkeleton />
    </div>
  );
}
