export interface Seller {
  _id: number;
  name: string;
  type?: string;
  image?: string;
  extra?: {
    introduction?: string;
    intro?: string;
    profileImage?: string;
  };
}

export interface SellerWithStats extends Seller {
  rating: number;
  reviewCount: number;
  topDishes: Array<{ imageSrc: string; name: string }>;
}

export interface SellerProfileClearProps {
  sellerId: number;
  sellerName: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  description: string;
}
