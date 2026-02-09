'use client';

import { useRef, useState } from 'react';

export type OrderItem = {
  name: string;
  quantity: number;
};

type ToastProps = {
  items: OrderItem[];
  index?: number;
  onClose: () => void;
};

export default function OrderToast({
  items,
  index = 0,
  onClose,
}: ToastProps) {
  const startY = useRef(0);
  const [offSetY, setOffsetY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - startY.current;
    if (diff < 0) setOffsetY(diff);
  };

  const handleTouchEnd = () => {
    if (offSetY < -50) {
      onClose();
    } else {
      setOffsetY(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
      style={{
        top: `${20 + index * 100}px`,
        transform: `translateX(-50%) translateY(${offSetY}px)`,
      }}
      className="fixed left-1/2 z-50 bg-gray-800 text-white p-5 rounded-lg shadow-lg transition-transform duration-150 cursor-pointer"
    >
      <p className="text-display-2 font-semibold whitespace-nowrap">
        새 주문이 들어왔습니다.
      </p>
      <div className="mt-1">
        {items.map((item, i) => (
          <p key={i} className="text-display-1 text-gray-300">
            {item.name} {item.quantity}개
          </p>
        ))}
      </div>
    </div>
  );
}
