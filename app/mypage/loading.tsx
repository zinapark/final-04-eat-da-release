import Header from '@/app/src/components/common/Header';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';

function ProfileSkeleton() {
  return (
    <section className="p-5 border border-gray-300 rounded-lg bg-gray-200 animate-pulse">
      <div className="flex items-start gap-2.5">
        {/* 프로필 이미지 */}
        <div className="w-15 h-15 rounded-full bg-gray-300 flex-none" />

        {/* 사용자 정보 */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 bg-gray-300 rounded w-24" />
          <div className="h-4 bg-gray-300 rounded w-36" />
          <div className="h-3 bg-gray-300 rounded w-40" />
        </div>

        {/* 로그아웃 자리 */}
        <div className="h-4 bg-gray-300 rounded w-12" />
      </div>

      {/* 장바구니/찜 목록 */}
      <div className="flex justify-around pt-4 gap-2.5">
        <div className="bg-white rounded-lg flex-1 py-5 flex flex-col items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
        <div className="bg-white rounded-lg flex-1 py-5 flex flex-col items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </section>
  );
}

function MenuListSkeleton() {
  return (
    <nav className="animate-pulse">
      <ul>
        {Array.from({ length: 7 }).map((_, i) => (
          <li
            key={i}
            className="py-5 border-b border-gray-300 flex items-center"
          >
            <div className="h-4 bg-gray-200 rounded w-24" />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MyPageSkeleton() {
  return (
    <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
      <ProfileSkeleton />
      <MenuListSkeleton />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <Header title="마이페이지" showSearch showCart />
      <MyPageSkeleton />
      <BottomNavigation />
    </>
  );
}
