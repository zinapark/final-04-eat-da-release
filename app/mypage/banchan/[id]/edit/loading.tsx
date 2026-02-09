import Header from '@/app/src/components/common/Header';

function FormFieldSkeleton({ width = 'w-full' }: { width?: string }) {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className={`h-10 bg-gray-200 rounded-lg ${width}`} />
    </div>
  );
}

export function EditBanchanSkeleton() {
  return (
    <div className="px-5 mt-15 mb-24 flex flex-col gap-5">
      {/* 판매 상태 토글 */}
      <div className="flex gap-2 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg flex-1" />
        <div className="h-10 bg-gray-200 rounded-lg flex-1" />
      </div>

      {/* 반찬 이름 */}
      <FormFieldSkeleton />

      {/* 이미지 영역 */}
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-12 mb-2" />
        <div className="flex gap-2">
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* 카테고리 */}
      <FormFieldSkeleton />

      {/* 가격 */}
      <FormFieldSkeleton />

      {/* 설명 */}
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-24 bg-gray-200 rounded-lg w-full" />
      </div>

      {/* 재료 */}
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-16 bg-gray-200 rounded-lg w-full" />
      </div>

      {/* 인분 */}
      <FormFieldSkeleton />

      {/* 재고 수량 */}
      <FormFieldSkeleton />

      {/* 픽업 장소 */}
      <FormFieldSkeleton />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="반찬 수정" showCloseButton />
      <EditBanchanSkeleton />
    </>
  );
}
