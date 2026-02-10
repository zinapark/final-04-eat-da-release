'use client';

import Header from '@/app/src/components/common/Header';
import CartItem from './CartItem';
import Link from 'next/link';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAxios, getTokenPayload } from '@/lib/axios';
import { CartItemType, CartResponse } from '@/app/src/types';
import useUserStore from '@/zustand/userStore';
import useCartStore from '@/zustand/cartStore';

const CartItemSkeleton = () => (
  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
    <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div className="w-8 h-6 bg-gray-200 rounded" />
          <div className="w-8 h-8 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-8 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export default function CartPageClient() {
  const router = useRouter();
  const { setCartCount } = useCartStore();
  const loggedInUser = useUserStore((state) => state.user);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tokenPayload = getTokenPayload();

    if (!tokenPayload && !loggedInUser) {
      router.replace('/login?redirect=/cart');
      return;
    }

    fetchCart();
  }, [loggedInUser, router]);

  useEffect(() => {
    const handleFocus = () => {
      if (loggedInUser || getTokenPayload()) {
        fetchCart();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loggedInUser]);

  const fetchCart = async () => {
    try {
      const axios = getAxios();
      const response = await axios.get<CartResponse>('/carts');
      const items = response.data.item;
      setCartItems(items);
      setCartCount(items.length);
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      if ((error as any)?.response?.status === 401) {
        router.replace('/login?redirect=/cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (cartId: number, newQuantity: number) => {
    try {
      const axios = getAxios();
      await axios.patch(`/carts/${cartId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error('수량 변경 실패:', error);
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    try {
      const axios = getAxios();
      await axios.delete(`/carts/${cartId}`);
      await fetchCart();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handlePurchaseClick = () => {
    if (cartItems.length === 0) return;
    router.push('/checkout');
  };

  if (!loggedInUser && !getTokenPayload()) {
    return null;
  }

  return (
    <>
      <Header
        title="장바구니"
        showBackButton={true}
        showSearch={true}
        showHome={!isLoading && cartItems.length > 0}
        showCart={isLoading || cartItems.length === 0}
      />
      <div className="min-h-screen flex flex-col">
        <div className="mt-6 mb-12 p-5 flex-1 flex flex-col">
          {isLoading ? (
            <>
              <div className="h-6 bg-gray-200 rounded w-24 mt-5 mb-3 animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))}
              </div>
            </>
          ) : cartItems.length > 0 ? (
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

        {cartItems.length > 0 && !isLoading && (
          <BottomFixedButton
            as="button"
            type="button"
            onClick={handlePurchaseClick}
          >
            구매하기
          </BottomFixedButton>
        )}
      </div>
    </>
  );
}
