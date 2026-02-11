import SellersListClient from '@/app/sellers/components/SellersListClient';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import ScrollToTop from '@/app/src/components/common/ScrollToTop';
import ProductsPageHeader from '@/app/src/components/ui/ProductsPageHeader';
import { getAxios } from '@/lib/axios';
import { getTier } from '@/lib/tier';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주부님 둘러보기 - 잇다',
  description: '우리 동네에서 정성껏 집밥을 만드시는 주부님들을 만나보세요.',
};

interface Seller {
  _id?: number;
  seller_id?: number;
  name: string;
  type?: string;
  image?: string | { path?: string };
  totalSales?: number;
  extra?: {
    description?: string;
    intro?: string;
    profileImage?: string;
  };
}

interface ProductSummary {
  _id: number;
  name: string;
  rating?: number;
  replies?: number;
  mainImages?: Array<{ path?: string; name?: string } | string>;
  extra?: {
    isSubscription?: boolean;
    pickupPlace?: string;
  };
}

interface DishThumbnail {
  imageSrc: string;
  name: string;
}

async function getSellers(): Promise<Seller[]> {
  try {
    const axios = getAxios();
    const res = await axios.get('/users/', { params: { limit: 200 } });
    const items: Seller[] = res.data.item || [];
    return items.filter((user) => user.type === 'seller');
  } catch (error) {
    // console.error('판매자 목록 조회 실패:', error);
    return [];
  }
}

async function getAllProducts(): Promise<ProductSummary[]> {
  try {
    const axios = getAxios();
    const res = await axios.get('/products', { params: { limit: 200 } });
    return res.data.item || [];
  } catch (error) {
    // console.error('상품 목록 조회 실패:', error);
    return [];
  }
}

function groupProductsBySeller(
  products: ProductSummary[]
): Record<number, ProductSummary[]> {
  return products.reduce(
    (acc, product) => {
      const sellerId = (product as ProductSummary & { seller_id?: number })
        .seller_id;
      if (sellerId) {
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(product);
      }
      return acc;
    },
    {} as Record<number, ProductSummary[]>
  );
}

function getProductImage(product: ProductSummary): string | null {
  const firstImage = product.mainImages?.[0];
  if (!firstImage) return null;
  if (typeof firstImage === 'string') return firstImage;
  if ('path' in firstImage && firstImage.path) return firstImage.path;
  return null;
}

function getTopDishes(products: ProductSummary[], limit = 6): DishThumbnail[] {
  return products
    .slice()
    .sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      const reviewDiff = (b.replies ?? 0) - (a.replies ?? 0);
      if (reviewDiff !== 0) return reviewDiff;
      return (a._id ?? 0) - (b._id ?? 0);
    })
    .map((product) => ({
      imageSrc: getProductImage(product),
      name: product.name,
    }))
    .filter((dish): dish is DishThumbnail => Boolean(dish.imageSrc))
    .slice(0, limit);
}

function getSellerRating(products: ProductSummary[]) {
  if (products.length === 0) {
    return { rating: 0, reviewCount: 0 };
  }

  const rating =
    products.reduce((sum, product) => sum + (product.rating ?? 0), 0) /
    products.length;
  const reviewCount = products.reduce(
    (sum, product) => sum + (product.replies ?? 0),
    0
  );

  return { rating, reviewCount };
}

export default async function SellersList() {
  // API 호출을 2번으로 최적화 (기존: 판매자 수 + 1번)
  const [sellers, allProducts] = await Promise.all([
    getSellers(),
    getAllProducts(),
  ]);

  const productsBySeller = groupProductsBySeller(allProducts);

  const sellerCards = sellers.map((seller) => {
    const sellerId = seller._id ?? seller.seller_id ?? 0;
    const products = productsBySeller[sellerId] || [];
    const dishesOnly = products.filter((p) => !p.extra?.isSubscription);
    const topDishes = getTopDishes(dishesOnly);
    const { rating, reviewCount } = getSellerRating(dishesOnly);

    const kitchens = [
      ...new Set(
        dishesOnly
          .map((p) => p.extra?.pickupPlace)
          .filter((k): k is string => Boolean(k))
      ),
    ];

    return {
      sellerId,
      seller,
      topDishes,
      rating,
      reviewCount,
      productCount: dishesOnly.length,
      tier: getTier(seller.totalSales as number).label,
      kitchens,
    };
  });
  const visibleSellerCards = sellerCards.filter(
    (card) => card.productCount >= 3
  );

  return (
    <>
      <ScrollToTop />
      <ProductsPageHeader />

      <SellersListClient sellerCards={visibleSellerCards} />

      <BottomNavigation />
    </>
  );
}
