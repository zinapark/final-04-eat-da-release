import SellerCard from '@/app/sellers/components/SellerCard';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import Header from '@/app/src/components/common/Header';
import { getAxios } from '@/lib/axios';

interface Seller {
  _id?: number;
  seller_id?: number;
  name: string;
  type?: string;
  image?: string;
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
}

interface DishThumbnail {
  imageSrc: string;
  name: string;
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

async function getAllProducts(): Promise<ProductSummary[]> {
  try {
    const axios = getAxios();
    const res = await axios.get('/products');
    return res.data.item || [];
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
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

function getTopDishes(products: ProductSummary[], limit = 5): DishThumbnail[] {
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
    const topDishes = getTopDishes(products);
    const { rating, reviewCount } = getSellerRating(products);

    return {
      sellerId,
      seller,
      topDishes,
      rating,
      reviewCount,
      productCount: products.length,
    };
  });
  const visibleSellerCards = sellerCards
    .filter((card) => card.productCount > 0)
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="flex flex-col gap-7.5 mt-15 pb-23">
      <Header title="주부 목록" showBackButton showSearch showCart />
      <div>
        {visibleSellerCards.map((card, index) => {
          const isLast = index === visibleSellerCards.length - 1;
          const sellerName = card.seller.name ?? '주부';
          const sellerDescription =
            card.seller.extra?.description ??
            card.seller.extra?.intro ??
            '정성스럽게 만든 집밥을 나눕니다.';
          const sellerProfileImage =
            card.seller.extra?.profileImage ??
            card.seller.image ??
            '/seller/seller1.png';

          return (
            <SellerCard
              key={card.sellerId}
              sellerId={card.sellerId}
              sellerName={sellerName}
              rating={card.rating}
              reviewCount={card.reviewCount}
              profileImage={sellerProfileImage}
              description={sellerDescription}
              topDishes={card.topDishes}
              showDivider={!isLast}
            />
          );
        })}
      </div>

      <BottomNavigation />
    </div>
  );
}
