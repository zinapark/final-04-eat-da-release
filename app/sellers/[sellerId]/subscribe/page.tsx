import { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";
import Header from "@/app/src/components/common/Header";
import { getAxios } from "@/lib/axios";
import { getTier } from "@/lib/tier";
import { Product } from "@/app/src/types";

export const metadata: Metadata = {
  title: "반찬 구독",
  description: "반찬 구독 신청 페이지",
};

interface Seller {
  _id: number;
  name: string;
  email: string;
  image?: string;
  extra?: {
    description?: string;
    intro?: string;
    profileImage?: string;
  };
}

interface SellerFromList {
  _id?: number;
  seller_id?: number;
  type?: string;
  totalSales?: number;
}

async function getSeller(sellerId: string): Promise<Seller | null> {
  try {
    const axios = getAxios();
    const res = await axios.get(`/users/${sellerId}`);
    return res.data.item;
  } catch (error) {
    console.error("판매자 정보 조회 실패:", error);
    return null;
  }
}

async function getSellers(): Promise<SellerFromList[]> {
  try {
    const axios = getAxios();
    const res = await axios.get("/users/");
    const items: SellerFromList[] = res.data.item || [];
    return items.filter((user) => user.type === "seller");
  } catch (error) {
    console.error("판매자 목록 조회 실패:", error);
    return [];
  }
}

async function getSellerProducts(sellerId: string): Promise<Product[]> {
  try {
    const axios = getAxios();
    const res = await axios.get(`/products`, {
      params: { seller_id: sellerId },
    });
    const products = res.data.item || [];
    return products.filter((p: Product) => !p.extra?.isSubscription);
  } catch (error) {
    console.error("판매자 상품 조회 실패:", error);
    return [];
  }
}

async function getSubscriptionProducts(sellerId: string): Promise<Product[]> {
  try {
    const axios = getAxios();
    const res = await axios.get(`/products`, {
      params: { seller_id: sellerId },
    });
    const products = res.data.item || [];
    return products.filter((p: Product) => p.extra?.isSubscription === true);
  } catch (error) {
    console.error("구독권 상품 조회 실패:", error);
    return [];
  }
}

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;

  const [seller, products, sellers, subscriptionProducts] = await Promise.all([
    getSeller(sellerId),
    getSellerProducts(sellerId),
    getSellers(),
    getSubscriptionProducts(sellerId),
  ]);

  const sellerFromList = sellers.find(
    (u) => u._id === Number(sellerId) || u.seller_id === Number(sellerId)
  );
  const sellerTier = getTier(sellerFromList?.totalSales ?? 0);

  const sellerName = seller?.name ?? "주부";
  const sellerDescription =
    seller?.extra?.description ??
    seller?.extra?.intro ??
    "정성스럽게 만든 집밥을 나눕니다.";
  const sellerProfileImage =
    seller?.extra?.profileImage ?? seller?.image ?? "/seller/seller1.png";

  const totalRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.rating ?? 0), 0) / products.length
      : 0;
  const totalReviewCount = products.reduce(
    (sum, p) =>
      sum + (Array.isArray(p.replies) ? p.replies.length : (p.replies ?? 0)),
    0
  );

  return (
    <>
      <Header title={`${metadata.title}`} showCloseButton />
      <SubscriptionClient
        sellerName={sellerName}
        sellerTier={sellerTier.label}
        sellerRating={totalRating}
        sellerReviewCount={totalReviewCount}
        sellerProfileImage={sellerProfileImage}
        sellerDescription={sellerDescription}
        subscriptionProducts={subscriptionProducts}
      />
    </>
  );
}
