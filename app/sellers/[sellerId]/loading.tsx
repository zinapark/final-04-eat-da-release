import Header from '@/app/src/components/common/Header';

function SellerProfileSkeleton() {
  return (
    <div className="flex items-start mx-5 gap-2.5 py-4 animate-pulse">
      <div className="h-15 w-15 rounded-full bg-gray-200 flex-none" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
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

function ReviewSkeleton() {
  return (
    <div className="px-5 py-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col gap-7.5 mt-15 pt-7.5 pb-23">
      <Header title=" " showBackButton showSearch showCart />

      <SellerProfileSkeleton />

      <div className="grid grid-cols-2 sm:grid-cols-3 sm:gap-2 sm:px-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

      <div className="px-5">
        <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
