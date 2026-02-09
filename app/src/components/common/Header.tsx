'use client';

import { getAxios } from '@/lib/axios';
import useCartStore from '@/zustand/cartStore';
import useNotificationStore from '@/zustand/notificationStore';
import useUserStore from '@/zustand/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showHome?: boolean;
  showNotification?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onSearch?: () => void;
  onCart?: () => void;
  onHome?: () => void;
}

export default function Header({
  title,
  showBackButton = false,
  showCloseButton = false,
  showSearch = false,
  showCart = false,
  showHome = false,
  showNotification = false,
  onBack,
  onClose,
  onSearch,
  onCart,
  onHome,
}: HeaderProps) {
  const router = useRouter();
  const { cartCount, setCartCount } = useCartStore();
  const user = useUserStore((state) => state.user);
  const unreadCount = useNotificationStore((state) =>
    showNotification && user ? state.unreadCountForSeller(user._id) : 0
  );

  const fetchCartCount = async () => {
    try {
      const axios = getAxios();
      const response = await axios.get('/carts');
      const items = response.data.item || [];
      setCartCount(items.length);
    } catch (error) {
      console.error('장바구니 개수 조회 실패:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (showCart && user) {
      fetchCartCount();
    }
  }, [showCart, user]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    } else {
      router.push('/search');
    }
  };

  const handleCart = () => {
    if (onCart) {
      onCart();
    } else {
      router.push('/cart');
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      router.push('/home');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="w-full max-w-[744px] min-w-[390px] mx-auto px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 뒤로가기 + 제목 */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="text-gray-900"
                aria-label="뒤로가기"
              >
                <img src="/back.svg" alt="뒤로가기" width={10} height={18} />
              </button>
            )}
            <h1 className="text-display-6 font-semibold text-gray-900">
              {title}
            </h1>
          </div>

          {/* 오른쪽: X, 검색, 장바구니/홈 */}
          <div className="flex gap-4 items-center">
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="text-gray-900"
                aria-label="닫기"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            {showSearch && (
              <button onClick={handleSearch} className="text-gray-900">
                <img src="/search.svg" alt="검색" width={21} height={21} />
              </button>
            )}
            {showNotification && (
              <button
                onClick={() => router.push('/mypage/notifications')}
                className="text-gray-900 relative"
                aria-label="알림"
              >
                <img
                  src="/Notification.svg"
                  alt="알림"
                  width={21}
                  height={21}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-eatda-orange text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            {showHome ? (
              <button onClick={handleHome} className="text-gray-900">
                <img src="/Home.svg" alt="홈" width={21} height={21} />
              </button>
            ) : showCart ? (
              <button onClick={handleCart} className="text-gray-900 relative">
                <img
                  src="/shopping cart.svg"
                  alt="장바구니"
                  width={22}
                  height={22}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-eatda-orange text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
