export interface Product {
  _id: number;
  name: string;
  price: number;
  content?: string;
  quantity?: number;
  buyQuantity?: number;
  createdAt?: string;
  mainImages?: { path: string; name: string }[];
  seller?: {
    _id?: number;
    name?: string;
    totalSales?: number;
    extra?: { description?: string; intro?: string };
  };
  rating?: number;
  replies?: Reply[] | number;
  myBookmarkId?: number;
  extra?: {
    category?: string[];
    categoryLabel?: string;
    ingredients?: string[];
    servings?: string;
    pickupPlace?: string;
    isSubscription?: boolean;
    frequency?: string;
    portions?: string;
  };
}

export interface Reply {
  _id: number;
  user?: { _id?: number; name?: string; image?: string };
  rating?: number;
  createdAt?: string;
  content?: string;
  extra?: { images?: string[] };
}

export interface ProductCardProps {
  productId: number;
  imageSrc: string;
  chefName: string;
  tier?: string;
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
