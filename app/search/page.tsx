import { Metadata } from 'next';
import SearchPageCilent from '@/app/search/SearchPageCilent';

export const metadata: Metadata = {
  title: '검색 - 잇다',
  description: '원하는 반찬을 검색해보세요.',
};

export default function SearchPage() {
  return <SearchPageCilent />;
}
