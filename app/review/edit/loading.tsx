import Header from '@/app/src/components/common/Header';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';

function ProductInfoSkeleton() {
  return (
    <div className="py-4 border-b border-gray-400 animate-pulse">
      <div className="flex gap-4 mb-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-28" />
        </div>
      </div>
    </div>
  );
}

function ImageUploadSkeleton() {
  return (
    <div className="py-6 border-b border-gray-400 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-20 mb-3" />
      <div className="flex gap-2">
        <div className="w-20 h-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

function StarRatingSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-40 mb-3" />
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-6 h-6 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  );
}

function TextareaSkeleton() {
  return (
    <div className="pt-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-12 bg-gray-200 rounded w-full" />
    </div>
  );
}

export function ReviewEditSkeleton() {
  return (
    <div className="flex-1 px-5 py-6 overflow-y-auto pb-32">
      <ProductInfoSkeleton />
      <ImageUploadSkeleton />
      <StarRatingSkeleton />
      <TextareaSkeleton />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="리뷰수정" showCloseButton />
      <div className="h-[60px]" />
      <ReviewEditSkeleton />
      <BottomFixedButton as="button" type="button" onClick={() => {}} disabled>
        등록하기
      </BottomFixedButton>
    </div>
  );
}
