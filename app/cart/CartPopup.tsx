"use client";

import { CartPopupProps } from "@/app/src/types";
import CartPopupItem from "./CartPopupItem";
import { useRouter } from "next/navigation";

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

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddToCart = async () => {
    onAddToCart();
    router.push("/cart");
  };

  const handleBuyNow = async () => {
    onBuyNow();
    router.push("/checkout");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto">
        <div className="px-5 pb-5 pt-3 flex flex-col gap-5">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />

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
