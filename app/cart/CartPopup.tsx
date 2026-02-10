'use client';

import { CartPopupProps } from '@/app/src/types';
import CartPopupItem from './CartPopupItem';
import { useRouter, usePathname } from 'next/navigation';
import useUserStore from '@/zustand/userStore';
import { useState, useRef } from 'react';

export default function CartPopup({
  isOpen,
  onClose,
  items,
  onQuantityChange,
  onRemoveItem,
  onAddToCart,
  onBuyNow,
}: CartPopupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const CLOSE_THRESHOLD = 150;

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    const deltaY = clientY - startYRef.current;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (translateY > CLOSE_THRESHOLD) {
      onClose();
    }
    setTranslateY(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddToCart = async () => {
    await onAddToCart();
    router.push('/cart');
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    onBuyNow();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div
        className="fixed max-w-[744px] min-w-[390px] w-full left-1/2 -translate-x-1/2 bottom-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="px-5 pb-5 pt-3 flex flex-col gap-5">
          <div
            className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleMouseDown}
          />

          {items.map((item) => (
            <CartPopupItem
              key={item.id}
              item={item}
              onQuantityChange={(newQuantity) =>
                onQuantityChange(item.id, newQuantity)
              }
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}

          <div className="flex justify-between">
            <p className="text-display-2 font-semibold">총 결제 금액</p>
            <p className="text-display-2 font-semibold text-eatda-orange">
              {totalAmount.toLocaleString()}원
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleAddToCart}
              className="py-4 w-full bg-gray-200 border-gray-300 border rounded-lg font-semibold"
            >
              장바구니 담기
            </button>
            <button
              onClick={handleBuyNow}
              className="py-4 w-full rounded-lg font-semibold bg-eatda-orange text-white"
            >
              바로 구매하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
