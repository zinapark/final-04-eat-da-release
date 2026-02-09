import Header from '@/app/src/components/common/Header';

function SellerProfileSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex-none" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-3.5 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="mt-3 h-4 bg-gray-200 rounded w-full" />
      <div className="mt-1.5 h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
}

function SubscriptionCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex flex-col gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded w-36" />
        <div className="h-3.5 bg-gray-200 rounded w-48" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-3.5 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export function SubscriptionSkeleton() {
  return (
    <div className="px-5 mt-15 mb-24 flex flex-col gap-5 min-h-[calc(100vh-10rem)]">
      <div className="animate-pulse h-4 bg-gray-200 rounded w-56" />

      <SellerProfileSkeleton />

      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>

      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-13 bg-gray-200 rounded-lg w-full" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SubscriptionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="구독 관리" showCloseButton />
      <SubscriptionSkeleton />
    </>
  );
}
