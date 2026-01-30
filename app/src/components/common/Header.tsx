"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showHome?: boolean; // 홈 버튼 추가
  onBack?: () => void;
  onClose?: () => void;
  onSearch?: () => void;
  onCart?: () => void;
  onHome?: () => void; // 홈 핸들러 추가
}

export default function Header({
  title,
  showBackButton = false,
  showCloseButton = false,
  showSearch = false,
  showCart = false,
  showHome = false, // 기본값 false
  onBack,
  onClose,
  onSearch,
  onCart,
  onHome,
}: HeaderProps) {
  const router = useRouter();

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
      console.log("검색");
    }
  };

  const handleCart = () => {
    if (onCart) {
      onCart();
    } else {
      router.push("/cart");
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      router.push("/home");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white px-4 pt-4 pb-3 z-50">
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
          {showHome ? (
            // 홈 버튼 (장바구니 페이지용)
            <button onClick={handleHome} className="text-gray-900">
              <img src="/Home.svg" alt="홈" width={21} height={21} />
            </button>
          ) : showCart ? (
            // 장바구니 버튼 (일반 페이지용)
            <button onClick={handleCart} className="text-gray-900 relative">
              <img
                src="/shopping cart.svg"
                alt="장바구니"
                width={22}
                height={22}
              />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
