import Header from '@/app/src/components/common/Header';

function StatusButtonSkeleton() {
  return (
    <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
  );
}

function OrderCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      <div className="flex flex-col gap-2 mb-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded flex-none" />
            <div className="flex-1">
              <div className="h-3.5 bg-gray-200 rounded w-24 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3">
        <div className="flex justify-between">
          <div className="h-3.5 bg-gray-200 rounded w-16" />
          <div className="h-3.5 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex justify-between">
          <div className="h-3.5 bg-gray-200 rounded w-16" />
          <div className="h-3.5 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function OrdersSkeleton() {
  return (
    <div className="px-5 mt-15 mb-24 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatusButtonSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="주문 관리" showBackButton showSearch showCart />
      <OrdersSkeleton />
    </>
  );
}
