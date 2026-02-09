export interface PurchaseProduct {
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
  extra?: {
    category: string[];
    categoryLabel: string;
    ingredients: string[];
    servings: string;
    pickupPlace: string;
  };
}

import type { OrderStateCode } from "./orderManagement";

export interface PurchaseData {
  _id: number;
  products: PurchaseProduct[];
  state: OrderStateCode;
  extra: {
    pickupDate: string;
    pickupTime: string;
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

export interface PurchasesResponse {
  ok: boolean;
  item: PurchaseData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
