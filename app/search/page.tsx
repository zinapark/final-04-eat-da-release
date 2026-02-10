import { Metadata } from 'next';
import SearchPageCilent from '@/app/search/SearchPageCilent';

export const metadata: Metadata = {
  title: '잇다 검색',
  openGraph: {
    title: '잇다 검색',
    description: '검색 페이지',
    url: '/search',
  },
};

export default function SearchPage() {
  return <SearchPageCilent />;
}
