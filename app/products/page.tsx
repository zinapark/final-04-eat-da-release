import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import Header from '@/app/src/components/common/Header';
import ProductsListClient from '@/app/src/components/ui/ProductsListClient';
import { Product } from '@/app/src/types';
import { getAxios } from '@/lib/axios';

interface Seller {
  _id?: number;
  seller_id?: number;
  name: string;
  type?: string;
  totalSales?: number;
}

async function getProducts(): Promise<Product[]> {
  try {
    const axios = getAxios();
    const res = await axios.get('/products/', { params: { limit: 200 } });
    const products = res.data.item || [];
    // 구독권 제외
    return products.filter((p: Product) => !p.extra?.isSubscription);
  } catch (error) {
    console.error('상품 조회 실패:', error);
    return [];
  }
}

async function getSellers(): Promise<Seller[]> {
  try {
    const axios = getAxios();
    const res = await axios.get('/users/');
    const items: Seller[] = res.data.item || [];
    return items.filter((user) => user.type === 'seller');
  } catch (error) {
    console.error('판매자 목록 조회 실패:', error);
    return [];
  }
}

async function getProductsWithSellerTier(): Promise<Product[]> {
  const [products, sellers] = await Promise.all([getProducts(), getSellers()]);

  const sellerSalesMap = new Map<number, number>();
  sellers.forEach((seller) => {
    const sellerId = seller._id ?? seller.seller_id;
    if (sellerId) {
      sellerSalesMap.set(sellerId, seller.totalSales ?? 0);
    }
  });

  return products.map((product) => {
    const sellerId = product.seller?._id;
    if (sellerId && sellerSalesMap.has(sellerId)) {
      return {
        ...product,
        seller: {
          ...product.seller,
          totalSales: sellerSalesMap.get(sellerId),
        },
      };
    }
    return product;
  });
}

export default async function ProductsList() {
  const products = await getProductsWithSellerTier();

  return (
    <>
      <Header title="서교동 공유주방" showBackButton showSearch showCart />

      <ProductsListClient products={products} />

      <BottomNavigation />
    </>
  );
}
