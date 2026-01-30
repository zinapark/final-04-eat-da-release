'use client';

import { useState } from 'react';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import CartPopup from '@/app/cart/CartPopup';
import { CartItem } from '@/app/src/types';
import { getAxios } from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
  product: {
    _id: number;
    name: string;
    price: number;
    mainImages?: { path: string; name: string }[];
  };
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    try {
      const axios = getAxios();

      for (const item of items) {
        await axios.post('/carts', {
          product_id: Number(item.id),
          quantity: item.quantity,
        });
      }

      router.push('/cart');
    } catch (error) {
      console.error('장바구니 담기 실패:', error);
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
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </>
  );
}
