import WishlistPageClient from './WishlistPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '위시리스트 - 잇다',
  description: '찜한 반찬을 한눈에 확인하고 주문하세요.',
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
