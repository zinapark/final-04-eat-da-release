import { getAxios } from "@/lib/axios";
import type {
  SellerOrderData,
  SellerOrdersResponse,
  OrderStateCode,
} from "@/app/src/types";

export async function fetchSellerOrders(): Promise<SellerOrderData[]> {
  const axios = getAxios();
  const res = await axios.get<SellerOrdersResponse>("/seller/orders");
  return res.data.item;
}

export async function updateOrderState(
  orderId: number,
  state: OrderStateCode,
): Promise<void> {
  const axios = getAxios();
  await axios.patch(`/seller/orders/${orderId}`, { state });
}
