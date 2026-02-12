'use client';

import { useEffect, useRef, useState } from 'react';

export type OrderItem = {
  name: string;
  quantity: number;
};

type ToastProps = {
  variant?: 'order' | 'pickup' | 'pickup-done';
  items?: OrderItem[];
  message?: string;
  onClose: () => void;
};

const config = {
  order: {
    title: '새 주문이 들어왔습니다.',
    textColor: 'text-black',
  },
  pickup: {
    title: '픽업 안내',
    textColor: 'text-black',
  },
  'pickup-done': {
    title: '픽업 안내',
    textColor: 'text-eatda-orange',
  },
};

export default function Toast({
  variant = 'order',
  items,
  message,
  onClose,
}: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const [offSetY, setOffsetY] = useState(0);
  const closingRef = useRef(false);
  const { title, textColor } = config[variant];

  // 진입 애니메이션
  useEffect(() => {
    const el = toastRef.current;
    if (!el) return;
    const isMobile = window.matchMedia('(max-width: 468px)').matches;
    el.animate(
      isMobile
        ? [
            { transform: 'translateY(-100%)' },
            { transform: 'translateY(0)' },
          ]
        : [
            { transform: 'translateX(100%)' },
            { transform: 'translateX(0)' },
          ],
      { duration: 350, easing: 'ease-out', fill: 'forwards' },
    );
  }, []);

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;

    const el = toastRef.current;
    if (!el) {
      onClose();
      return;
    }

    const isMobile = window.matchMedia('(max-width: 468px)').matches;
    const anim = el.animate(
      isMobile
        ? [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-100%)' },
          ]
        : [
            { transform: 'translateX(0)' },
            { transform: 'translateX(100%)' },
          ],
      { duration: 300, easing: 'ease-in', fill: 'forwards' },
    );
    anim.onfinish = () => onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - startY.current;
    if (diff < 0) setOffsetY(diff);
  };

  const handleTouchEnd = () => {
    if (offSetY < -50) {
      handleClose();
    } else {
      setOffsetY(0);
    }
  };

  return (
    <div
      ref={toastRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClose}
      style={{
        transform: `translateY(${offSetY}px)`,
      }}
      className={`w-full max-w-105 self-end max-[468px]:self-center bg-gray-200/70 backdrop-blur-sm border border-gray-300 ${textColor}
      p-5 rounded-lg shadow-lg cursor-pointer pointer-events-auto`}
    >
      <p className="text-display-2 font-semibold whitespace-nowrap">{title}</p>
      <div className="mt-1">
        {variant === 'order' && items ? (
          <p className="text-display-1">
            {items.length === 1
              ? `${items[0].name}`
              : `${items[0].name} 외 ${items.length - 1}건`}
          </p>
        ) : message ? (
          (() => {
            const lines = message.split('\n');
            if (lines.length === 1) {
              return <p className="text-display-1">{lines[0]}</p>;
            }
            return lines.map((line, i) => (
              <p key={i} className="text-display-1 flex items-center gap-1">
                <span className="text-[8px]">●</span>
                {line}
              </p>
            ));
          })()
        ) : null}
      </div>
    </div>
  );
}
