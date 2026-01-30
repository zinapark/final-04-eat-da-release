"use client";

import { useState } from "react";
import CartPopup from "@/app/cart/CartPopup";
import { CartItem } from "@/app/src/types";

export default function ProductPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "얼큰한 김치찌개",
      price: 8500,
      quantity: 2,
    },
  ]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddToCart = () => {
    console.log("장바구니에 추가", cartItems);
    setIsCartOpen(false);
  };

  const handleBuyNow = () => {
    console.log("바로 구매", cartItems);
    setIsCartOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsCartOpen(true)}>장바구니 열기</button>

      <CartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </>
  );
}
