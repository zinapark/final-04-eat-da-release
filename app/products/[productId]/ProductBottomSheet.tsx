'use client';

import { useState } from 'react';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import CartPopup from '@/app/cart/CartPopup';
import { CartItem } from '@/app/src/types';
import { getAxios } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import useCartStore from '@/zustand/cartStore';

interface ProductBottomSheetProps {
  product: {
    _id: number;
    name: string;
    price: number;
    mainImages?: { path: string; name: string }[];
    extra?: {
      pickupPlace?: string;
    };
  };
  availableStock: number;
}

export default function ProductBottomSheet({
  product,
  availableStock,
}: ProductBottomSheetProps) {
  const router = useRouter();
  const { incrementCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [items, setItems] = useState<CartItem[]>([
    {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.mainImages?.[0]?.path || '/food1.png',
    },
  ]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > availableStock) {
      alert(`남은 수량이 ${availableStock}개입니다.`);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: newQuantity } : it))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (items.length === 1) {
      handleClose();
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const axios = getAxios();
      const currentPickupPlace = product.extra?.pickupPlace || ' ';
      const cartResponse = await axios.get('/carts');
      const cartItems = cartResponse.data.item || [];

      if (cartItems.length > 0) {
        const firstItem = cartItems[0];
        const cartPickupPlace = firstItem.product.extra?.pickupPlace || ' ';

        if (currentPickupPlace !== cartPickupPlace) {
          alert(
            `다른 공유주방 상품입니다.\n장바구니에는 '${cartPickupPlace}' 상품만 담을 수 있습니다.\n현재 상품은 '${currentPickupPlace}'입니다.`
          );
          return;
        }
      }

      // 장바구니에 추가
      await axios.post('/carts', {
        product_id: product._id,
        quantity: items[0].quantity,
      });

      incrementCart();

      handleClose();
    } catch (error: any) {
      // console.error('장바구니 추가 실패:', error);

      if (error.response?.status === 409) {
        alert('이미 장바구니에 담긴 상품입니다.');
      } else if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/login');
      } else {
        alert('장바구니 추가에 실패했습니다.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const directPurchase = {
      productId: product._id,
      quantity: items[0].quantity,
      totalAmount: totalAmount,
    };

    localStorage.setItem('directPurchase', JSON.stringify(directPurchase));
    router.push('/checkout?direct=true');
  };

  const isSoldOut = availableStock <= 0;

  return (
    <>
      <BottomFixedButton
        as="button"
        type="button"
        onClick={handleOpen}
        disabled={isSoldOut}
      >
        {isSoldOut ? '품절' : '구매하기'}
      </BottomFixedButton>

      <CartPopup
        isOpen={isOpen}
        onClose={handleClose}
        items={items}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </>
  );
}
