// 판매자 주문 관리용 타입

export interface SellerOrderProduct {
  _id: number;
  quantity: number;
  seller_id: number;
  name: string;
  seller?: {
    name: string;
    _id: number;
    image?: string;
  };
  image: {
    path: string;
    name: string;
  };
  price: number;
  extra?: {
    pickupPlace?: string;
    pickupLocation?: string;
    [key: string]: unknown;
  };
}

// 주문 상태
export type OrderStateCode = "OS020" | "OS040" | "OS060" | "OS080" | "OS310";
export type OrderStatus = "대기중" | "승인됨" | "조리완료" | "픽업완료" | "취소됨";

export const orderState: Record<OrderStateCode, OrderStatus> = {
  OS020: "대기중",
  OS040: "승인됨",
  OS060: "조리완료",
  OS080: "픽업완료",
  OS310: "취소됨",
};

export interface OrderUser {
  _id: number;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
}

export interface SellerOrderData {
  _id: number;
  products: SellerOrderProduct[];
  state: OrderStateCode;
  user_id: number;
  user?: OrderUser;
  extra?: {
    pickupDate?: string;
    pickupTime?: string;
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

export interface SellerOrdersResponse {
  ok: number;
  item: SellerOrderData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
