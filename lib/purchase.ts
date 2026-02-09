import { getAxios } from "@/lib/axios";
import type { PurchaseData, PurchasesResponse } from "@/app/src/types";

export async function fetchPurchases(): Promise<PurchaseData[]> {
  const axios = getAxios();
  const res = await axios.get<PurchasesResponse>("/orders");
  return res.data.item;
}

export async function fetchPurchaseDetail(id: string): Promise<PurchaseData> {
  const axios = getAxios();
  const res = await axios.get<{ ok: boolean; item: PurchaseData }>(
    `/orders/${id}`,
  );
  return res.data.item;
}
