import Header from '@/app/src/components/common/Header';

function ImageSliderSkeleton() {
  return <div className="w-full aspect-square bg-gray-200 animate-pulse" />;
}

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

function ProductInfoSkeleton() {
  return (
    <div className="flex flex-col px-5 gap-4 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>

      <div className="flex flex-col gap-2 pb-5 border-b-[0.5px] border-gray-300">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-16" />
          ))}
        </div>
      </div>

      <div className="flex justify-between border-b-[0.5px] border-gray-300 pb-4">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="flex justify-between border-b-[0.5px] border-gray-300 pb-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
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

export function ProductDetailSkeleton() {
  return (
    <main className="flex flex-col mt-12.5 gap-5 pb-23">
      <Header title=" " showBackButton showSearch showCart />

      <ImageSliderSkeleton />

      <div className="flex mx-5 items-center animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-48" />
        <div className="ml-auto w-6 h-6 bg-gray-200 rounded" />
      </div>
      <div className="mx-5 -mt-3 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-28" />
      </div>

      <SellerProfileSkeleton />

      <ProductInfoSkeleton />

      <div className="px-5">
        <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <main className="flex flex-col mt-12.5 gap-5 pb-23">
      <Header title=" " showBackButton showSearch showCart />

      <ImageSliderSkeleton />

      <div className="flex mx-5 items-center animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-48" />
        <div className="ml-auto w-6 h-6 bg-gray-200 rounded" />
      </div>
      <div className="mx-5 -mt-3 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-28" />
      </div>

      <SellerProfileSkeleton />

      <ProductInfoSkeleton />

      <div className="px-5">
        <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
