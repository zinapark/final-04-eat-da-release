import { Metadata } from 'next';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
  title: '장바구니 - 잇다',
  description: '담아둔 반찬을 확인하고 주문을 완료하세요.',
};

export default function CartPage() {
  return <CartPageClient />;
}
