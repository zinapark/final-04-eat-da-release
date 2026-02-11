import HomePageClient from './HomePageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '잇다 - 우리 동네 주부님의 정성 가득 집밥',
  description:
    '신선한 재료로 만든 집밥 반찬을 만나보세요. 오늘의 추천 반찬과 주부님을 소개합니다.',
};

export default function Home() {
  return <HomePageClient />;
}
