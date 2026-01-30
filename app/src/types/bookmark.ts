export interface BookmarkProduct {
  _id: number;
  type: string;
  user_id: number;
  target_id: number;
  memo?: string;
  createdAt: string;
  product: {
    _id: number;
    name: string;
    price: number;
    mainImages?: { path: string; name: string }[];
    seller?: { name?: string };
    extra?: {
      rating?: number;
      replies?: number;
    };
  };
}

export interface HeartProps {
  size?: number;
}
export interface WishButtonProps {
  initialWished?: boolean;
  lineColor?: "black" | "white";
  size?: number;
  className?: string;
  onToggle?: (isWished: boolean) => void;
}
