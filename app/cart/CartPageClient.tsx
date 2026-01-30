"use client";

import Header from "@/app/src/components/common/Header";
import CartItem from "./CartItem";
import Link from "next/link";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import { useEffect, useState } from "react";
import { getAxios } from "@/lib/axios";
import { CartItemType, CartResponse } from "@/app/src/types";

export default function CartPageClient() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const axios = getAxios();
      const response = await axios.get<CartResponse>("/carts");
      setCartItems(response.data.item);
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartId: number, newQuantity: number) => {
    try {
      const axios = getAxios();
      await axios.patch(`/carts/${cartId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error("수량 변경 실패:", error);
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    try {
      const axios = getAxios();
      await axios.delete(`/carts/${cartId}`);
      await fetchCart();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header
          title="장바구니"
          showBackButton={true}
          showSearch={true}
          showCart={true}
        />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="장바구니"
        showBackButton={true}
        showSearch={true}
        showHome={true}
      />
      <div className="min-h-screen flex flex-col">
        <div className="mt-6 mb-12 p-5 flex-1 flex flex-col">
          {cartItems.length > 0 ? (
            <>
              <p className="text-paragraph-md mt-5 mb-3">
                {cartItems.length}개 상품
              </p>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    cartId={item._id}
                    productId={item.product._id}
                    imageSrc={item.product.image.path}
                    chefName={item.product.seller.name}
                    productName={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-paragraph-md text-center mb-6">
                담긴 반찬이 없습니다.
                <br />
                오늘의 식탁을 채워줄 동네 반찬을 만나보세요.
              </p>
              <Link href="/">
                <button className="px-5 py-3 bg-gray-200 border border-gray-300 text-paragraph-sm rounded-lg">
                  반찬 둘러보기
                </button>
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <BottomFixedButton as="link" href="/checkout">
            구매하기
          </BottomFixedButton>
        )}
      </div>
    </>
  );
}
