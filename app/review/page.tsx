import ReviewManagementPage from '@/app/review/ReviewPageCilent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '잇다 리뷰 페이지',
  openGraph: {
    title: '잇다 리뷰 페이지',
    description: '리뷰 페이지',
    url: '/review',
  },
};

export default function ReviewPage() {
  return <ReviewManagementPage />;
}
