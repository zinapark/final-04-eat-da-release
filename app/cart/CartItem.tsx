import { CartItemProps } from "@/app/src/types";
import Image from "next/image";

export default function CartItem({
  cartId,
  productId,
  imageSrc,
  productName,
  chefName,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(cartId, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1 && onQuantityChange) {
      onQuantityChange(cartId, quantity - 1);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(cartId);
    }
  };

  const totalPrice = price * quantity;

  return (
    <div className="py-3 border-b-[0.5px] border-gray-400">
      <div className="flex gap-5 mb-3">
        <Image
          src={imageSrc}
          width={70}
          height={70}
          alt={productName}
          className="rounded-lg object-cover w-17.5 h-17.5"
        />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-paragraph">{productName}</p>
            <button onClick={handleRemove}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="mt-1"
              >
                <path
                  d="M10.3999 0.649902L0.649902 10.3999"
                  stroke="#353E5C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M0.649902 0.649902L10.3999 10.3999"
                  stroke="#353E5C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <p className="text-x-small text-gray-500">{chefName} 주부</p>
          <p className="font-semibold text-paragraph-sm text-eatda-orange">
            {price.toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-6 h-6 bg-gray-200 rounded-xs flex items-center justify-center disabled:opacity-50"
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
            {quantity}
          </p>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 bg-gray-200 rounded-xs flex items-center justify-center"
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
        <div className="">
          <p className="text-right text-gray-500 text-x-small">총합</p>
          <p className="font-semibold text-paragraph">
            {totalPrice.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
}
