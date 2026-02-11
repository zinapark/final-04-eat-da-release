import ReviewManagementPage from '@/app/review/ReviewPageCilent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '리뷰 - 잇다',
  description: '솔직한 반찬 후기를 써보세요!',
};

export default function ReviewPage() {
  return <ReviewManagementPage />;
}
