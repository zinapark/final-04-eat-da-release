export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export interface CartItemProps {
  cartId: number;
  productId: number;
  imageSrc: string;
  productName: string;
  chefName: string;
  price: number;
  quantity: number;
  onQuantityChange?: (cartId: number, newQuantity: number) => void;
  onRemove?: (cartId: number) => void;
}

export interface CartProduct {
  _id: number;
  name: string;
  price: number;
  seller_id: number;
  quantity: number;
  seller: {
    name: string;
    _id: number;
  };
  buyQuantity: number;
  image: {
    path: string;
    name: string;
  };
  extra: {
    isNew: boolean;
    isBest: boolean;
    category: string[];
  };
}

export interface CartItemType {
  _id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}

export interface CartResponse {
  ok: number;
  item: CartItemType[];
  cost: {
    products: number;
    shippingFees: number;
    discount: {
      products: number;
      shippingFees: number;
    };
    total: number;
  };
}
