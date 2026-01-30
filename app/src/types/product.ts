export interface Product {
  _id: number;
  name: string;
  price: number;
  mainImages?: { path: string; name: string }[];
  seller?: { name?: string };
  rating?: number;
  replies?: number;
  myBookmarkId?: unknown;
  extra?: {
    category?: string[];
    categoryLabel?: string;
  };
}

export interface ProductCardProps {
  productId: number;
  imageSrc: string;
  chefName: string;
  dishName: string;
  rating: number;
  reviewCount: number;
  price: number;
  initialWished?: boolean;
  bookmarkId?: number;
  isLcp?: boolean;
  onBookmarkChange?: () => void;
}

export interface CheckoutProductItemProps {
  imageSrc: string;
  dishName: string;
  chefName: string;
  price: number;
  quantity: number;
}

export interface OrderProductItemProps {
  imageSrc: string;
  dishName: string;
  chefName: string;
  price: number;
  quantity?: number;
}
