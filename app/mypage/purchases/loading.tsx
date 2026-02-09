import Header from '@/app/src/components/common/Header';

function PurchaseCardSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-200 animate-pulse">
      <div className="w-12.5 h-12.5 rounded-lg bg-gray-200 flex-none" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-3.5 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
}

function PurchaseGroupSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between py-3 border-b border-gray-300">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-3.5 bg-gray-200 rounded w-16" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <PurchaseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PurchasesSkeleton() {
  return (
    <div className="px-5 mt-15 mb-24 flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <PurchaseGroupSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="구매 내역" showBackButton showSearch showCart />
      <PurchasesSkeleton />
    </>
  );
}
