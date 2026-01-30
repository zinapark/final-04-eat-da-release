export interface OrderProduct {
  _id: number;
  quantity: number;
  seller_id: number;
  name: string;
  seller: {
    name: string;
    _id: number;
  };
  image: {
    path: string;
    name: string;
  };
  price: number;
  extra?: any;
}

export interface OrderData {
  _id: number;
  products: OrderProduct[];
  extra: {
    pickupDate: string;
    pickupTime: string;
    pickupPlace: string;
  };
  cost: {
    products: number;
    shippingFees: number;
    discount: {
      products: number;
      shippingFees: number;
    };
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}
