'use client';

import { CartItem } from '@/app/src/types';

interface CartPopupItemProps {
  item: CartItem;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartPopupItem({
  item,
  onQuantityChange,
  onRemove,
}: CartPopupItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.quantity + 1);
  };

  return (
    <div className="flex justify-between pb-3 border-b-[0.5px] border-gray-400">
      <p className="text-display-2">{item.name}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              d="M16.4179 9.38184H2.34521"
              stroke="#353E5C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className="flex items-center justify-center text-paragraph">
          {item.quantity}
        </p>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              d="M9.33301 2.33398V16.334"
              stroke="#353E5C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.333 9.3335H2.33301"
              stroke="#353E5C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
