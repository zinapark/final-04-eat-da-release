import Header from '@/app/src/components/common/Header';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';

function SellerCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="mt-4 flex px-5 gap-1 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-square w-28 shrink-0 bg-gray-200"
          />
        ))}
      </section>

      <article className="flex items-start mx-5 gap-2.5 pt-5 pb-4">
        <div className="h-15 w-15 rounded-full bg-gray-200 flex-none" />

        <div className="flex flex-1 flex-col gap-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </article>

      <div className="mx-5 border-b-[0.5px] border-gray-300" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col gap-7.5 mt-15 pb-23">
      <Header title="주부 목록" showBackButton showSearch showCart />

      <div>
        {Array.from({ length: 4 }).map((_, i) => (
          <SellerCardSkeleton key={i} />
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}
