"use client";

import { useState } from "react";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import type { CartItem } from "@/types/cart";
import CartPopup from "@/app/cart/CartPopup";

export default function ProductDetailClient() {
  const [isOpen, setIsOpen] = useState(false);

  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "얼큰한 김치찌개",
      price: 8500,
      quantity: 1,
    },
  ]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: newQuantity } : it))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <>
      <BottomFixedButton as="button" type="button" onClick={handleOpen}>
        구매하기
      </BottomFixedButton>

      <CartPopup
        isOpen={isOpen}
        onClose={handleClose}
        items={items}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onAddToCart={() => console.log("장바구니 담기")}
        onBuyNow={() => console.log("바로 구매하기")}
      />
    </>
  );
}
