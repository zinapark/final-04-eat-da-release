import Header from '@/app/src/components/common/Header';

function DetailCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded flex-none" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-3.5 bg-gray-200 rounded w-28" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-gray-200 rounded w-4 flex-none" />
          <div className="h-3.5 bg-gray-200 rounded w-36" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-gray-200 rounded w-4 flex-none" />
          <div className="h-3.5 bg-gray-200 rounded w-28" />
        </div>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-3">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export function PurchaseDetailSkeleton() {
  return (
    <section className="flex-1 flex flex-col gap-5">
      <DetailCardSkeleton />
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
    </section>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="구매 내역 정보" showBackButton showSearch showCart />
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5">
        <PurchaseDetailSkeleton />
      </div>
    </>
  );
}
