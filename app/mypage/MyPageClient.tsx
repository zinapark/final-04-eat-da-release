"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTokenPayload } from "@/lib/axios";
import { getUser, getCartItems, getBookmarkCount } from "@/lib/mypage";

type UserInfo = Awaited<ReturnType<typeof getUser>>;

export default function MyPageClient() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo>(null);
  const [cartCount, setCartCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tokenPayload = getTokenPayload();
      if (!tokenPayload) {
        setLoading(false);
        return;
      }

      const [userData, cartItems, bmCount] = await Promise.all([
        getUser(tokenPayload._id),
        getCartItems(),
        getBookmarkCount(),
      ]);

      setUser(userData);
      setCartCount(cartItems.length);
      setBookmarkCount(bmCount);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="px-5 mt-16 mb-24 flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/home");
    return null;
  }

  const isSeller = user.type === "seller";

  return (
    <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
      {/* 프로필 섹션 */}
      <section className="p-5 border border-gray-400 rounded-lg bg-gray-200">
        <div className="flex items-start gap-2.5">
          {/* 프로필 이미지 */}
          {user.image ? (
            <Image
              src={user.image}
              alt="프로필"
              width={60}
              height={60}
              className="w-15 h-15 rounded-full object-cover"
            />
          ) : (
            <div className="w-15 h-15 rounded-full bg-gray-600"></div>
          )}

          {/* 사용자 정보 */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-1">
              <h2 className="text-display-3 font-semibold text-gray-800">
                {user.name}
              </h2>
              <span className="text-display-1 text-gray-600">주부 9단</span>
            </div>
            <p className="text-display-2 text-gray-800">{user.email}</p>
            <div className="flex items-center mt-1">
              <Image src="/Location.svg" alt="주소" width={16} height={16} />
              <span className="text-display-1 text-gray-800">
                {user.address}
              </span>
            </div>
          </div>

          {/* 로그아웃 */}
          <button className="text-display-1 text-nowrap text-gray-600 hover:text-gray-700">
            로그아웃
          </button>
        </div>

        {/* 장바구니/찜 목록 */}
        <div className="flex justify-around pt-4 gap-2.5">
          <Link
            href="/cart"
            className="bg-white rounded-lg text-center flex items-center justify-center cursor-pointer flex-1 py-2.5"
          >
            <div>
              <p className="text-display-3 font-bold text-eatda-orange">
                {cartCount}
              </p>
              <p className="text-display-1 text-gray-800 group-hover:text-gray-700 mt-1">
                장바구니
              </p>
            </div>
          </Link>
          <Link
            href="/wishlist"
            className="bg-white rounded-lg text-center flex items-center justify-center cursor-pointer flex-1 py-2.5"
          >
            <div>
              <p className="text-display-3 font-bold text-eatda-orange">
                {bookmarkCount}
              </p>
              <p className="text-display-1 text-gray-800 group-hover:text-gray-700 mt-1">
                찜 목록
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 전체 리스트 */}
      <nav>
        <ul>
          {/* 판매자 전용 */}
          {isSeller && (
            <>
              <Link
                href="/mypage/banchan"
                className="block py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
              >
                <span className="text-gray-800">반찬 관리</span>
              </Link>
              <Link
                href="/mypage/orders"
                className="block py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
              >
                <span className="text-gray-800">주문 / 픽업 관리</span>
              </Link>
            </>
          )}

          {/* 공통 */}
          <div className="flex flex-col">
            <Link
              href="/mypage/purchases"
              className="py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
            >
              <span className="text-gray-800">구매 내역</span>
            </Link>

            <Link
              href="/mypage/subscription"
              className="py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
            >
              <span className="text-gray-800">구독 관리</span>
            </Link>

            <Link
              href="/review"
              className="py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
            >
              <span className="text-gray-800">반찬 리뷰</span>
            </Link>

            <Link
              href="/mypage/verify"
              className="py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
            >
              <span className="text-gray-800">개인 정보 설정</span>
            </Link>

            <Link
              href="/mypage/support"
              className="py-5 hover:bg-gray-200 cursor-pointer border-b border-gray-400"
            >
              <span className="text-gray-800">고객센터</span>
            </Link>
          </div>
        </ul>
      </nav>
    </div>
  );
}
