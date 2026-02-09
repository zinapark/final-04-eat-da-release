import Header from '@/app/src/components/common/Header';

function BanchanCardSkeleton() {
  return (
    <div className="flex items-center gap-3 py-4 border-b border-gray-200 animate-pulse">
      <div className="w-17.5 h-17.5 rounded-lg bg-gray-200 flex-none" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-14 flex-none" />
    </div>
  );
}

export function BanchanManagementSkeleton() {
  return (
    <div className="px-5 mt-15 mb-24">
      <div className="animate-pulse mb-2">
        <div className="h-5 bg-gray-200 rounded w-32" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <BanchanCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="반찬 관리" showBackButton showSearch showCart />
      <BanchanManagementSkeleton />
    </>
  );
}
