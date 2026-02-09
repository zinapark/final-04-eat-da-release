import { Product } from '@/app/src/types/product';

export interface BookmarkProduct {
  _id: number;
  type: string;
  user_id: number;
  target_id: number;
  memo?: string;
  createdAt: string;
  product: Product;
}

export interface HeartProps {
  size?: number;
}
export interface WishButtonProps {
  initialWished?: boolean;
  lineColor?: 'black' | 'white';
  size?: number;
  className?: string;
  onToggle?: (isWished: boolean) => void;
}
