'use client';

import HomeHeader from '@/app/home/HomeHeader';
import RecommendProduct from '@/app/home/RecommendProduct';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import SellerProfileClear from '@/app/src/components/ui/SellerProfileClear';
import ProductCard from '@/app/src/components/ui/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getAxios } from '@/lib/axios';
import { Product, Seller, SellerWithStats } from '@/app/src/types';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { getTier } from '@/lib/tier';
import useNearestKitchen from '@/hooks/useNearestKitchen';
import Script from 'next/script';

const RecommendProductSkeleton = () => (
  <div className="shrink-0 w-28 animate-pulse">
    <div className="w-28 aspect-square bg-gray-200 rounded-lg" />
    <div className="pt-2 px-1">
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const RecommendSellerSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="shrink-0 w-28 h-28 bg-gray-200 rounded-lg" />
      ))}
    </div>
    <div className="flex items-start gap-2.5 rounded-lg px-2.5">
      <div className="h-15 w-15 bg-gray-200 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-0.5" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mt-1" />
      </div>
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="w-full aspect-square bg-gray-200" />
    <div className="pt-4 pb-5 px-2.5 space-y-1">
      <div className="flex gap-2 items-center">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="flex items-center gap-1">
        <div className="h-4 bg-gray-200 rounded w-2/5" />
        <div className="h-3 bg-gray-200 rounded w-1/5" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

export default function HomePageClient() {
  const { nearestKitchen, onKakaoLoad } = useNearestKitchen();
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);
  const [recommendSeller, setRecommendSeller] =
    useState<SellerWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('splashShown');
  });
  const [splashVisible, setSplashVisible] = useState(false);
  const [splashFading, setSplashFading] = useState(false);

  // 스플래시 애니메이션
  useEffect(() => {
    if (!showSplash) return;

    sessionStorage.setItem('splashShown', 'true');
    const showTimer = setTimeout(() => setSplashVisible(true), 100);
    const fadeTimer = setTimeout(() => setSplashFading(true), 3000);
    const hideTimer = setTimeout(() => setShowSplash(false), 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showSplash]);

  const handleLogoClick = () => {
    setSplashVisible(false);
    setSplashFading(false);
    setShowSplash(true);
  };

  const filteredProducts = useMemo(
    () => products.filter((p) => p.extra?.pickupPlace === nearestKitchen),
    [products, nearestKitchen]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axios = getAxios();
        const [productsRes, usersRes] = await Promise.all([
          axios.get('/products', {
            params: { limit: 1000 },
          }),
          axios.get('/users/'),
        ]);

        const rawProducts = productsRes.data.item || [];
        const allUsers = usersRes.data.item || [];
        const sellers = allUsers.filter(
          (user: Seller) => user.type === 'seller'
        );

        const productsWithSellerStats = rawProducts.map((product: Product) => {
          const seller = allUsers.find(
            (u: any) => u._id === product.seller?._id
          );
          return {
            ...product,
            seller: {
              ...product.seller,
              name: seller?.name ?? product.seller?.name,
              totalSales: seller?.totalSales ?? 0,
            },
          };
        });

        const allProducts = productsWithSellerStats.filter(
          (p: Product) => !p.extra?.isSubscription
        );

        setProducts(allProducts);

        const today = new Date().toDateString();
        const stored = localStorage.getItem('dailyRecommend');

        if (stored) {
          const { date, products: storedProducts } = JSON.parse(stored);
          if (date === today) {
            const validProducts = storedProducts
              .map((id: number) =>
                allProducts.find((p: Product) => p._id === id)
              )
              .filter(Boolean)
              .slice(0, 6);

            if (validProducts.length > 0) {
              setRecommendProducts(validProducts);
            }
          }
        }

        if (recommendProducts.length === 0) {
          const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, 6);
          setRecommendProducts(selected);

          localStorage.setItem(
            'dailyRecommend',
            JSON.stringify({
              date: today,
              products: selected.map((p: Product) => p._id),
            })
          );
        }

        const storedSeller = localStorage.getItem('dailyRecommendSeller');
        let foundSeller = false;

        if (storedSeller) {
          const { date, sellerId } = JSON.parse(storedSeller);
          if (date === today) {
            const seller = sellers.find((s: Seller) => s._id === sellerId);
            if (seller) {
              const sellerProductCount = allProducts.filter(
                (p: Product) => p.seller?._id === seller._id
              ).length;

              console.log(
                `저장된 주부 ${seller.name}의 상품 수:`,
                sellerProductCount
              );

              if (sellerProductCount >= 6) {
                const sellerWithStats = calculateSellerStats(
                  seller,
                  allProducts
                );
                setRecommendSeller(sellerWithStats);
                foundSeller = true;
              }
            }
          }
        }

        if (!foundSeller) {
          const eligibleSellers = sellers.filter((seller: Seller) => {
            const productCount = allProducts.filter(
              (p: Product) => p.seller?._id === seller._id
            ).length;
            return productCount >= 6;
          });

          console.log(
            '3개 이상 상품을 등록한 주부 수:',
            eligibleSellers.length
          );

          if (eligibleSellers.length > 0) {
            const randomSeller =
              eligibleSellers[
                Math.floor(Math.random() * eligibleSellers.length)
              ];

            console.log('선정된 주부:', randomSeller.name);

            const sellerWithStats = calculateSellerStats(
              randomSeller,
              allProducts
            );
            setRecommendSeller(sellerWithStats);

            localStorage.setItem(
              'dailyRecommendSeller',
              JSON.stringify({
                date: today,
                sellerId: randomSeller._id,
              })
            );
          }
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSellerStats = (
    seller: Seller,
    allProducts: Product[]
  ): SellerWithStats => {
    const sellerProducts = allProducts.filter(
      (p: Product) => p.seller?._id === seller._id
    );

    const rating =
      sellerProducts.length > 0
        ? sellerProducts.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
          sellerProducts.length
        : 0;

    const reviewCount = sellerProducts.reduce((sum, p) => {
      const replies = p.replies;
      if (Array.isArray(replies)) {
        return sum + replies.length;
      } else if (typeof replies === 'number') {
        return sum + replies;
      }
      return sum;
    }, 0);

    const topDishes = sellerProducts
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 6)
      .map((p) => ({
        imageSrc: p.mainImages?.[0]?.path ?? '/food1.png',
        name: p.name,
      }));

    return {
      ...seller,
      rating,
      reviewCount,
      topDishes,
    };
  };

  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: '67502dfa-39a4-4d1e-8332-59d195da33a7',
      hideChannelButtonOnBoot: true,
    });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return (
    <>
      {/* 스플래시 오버레이 */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-[#ff6155] min-[391px]:bg-[#ffffff] flex items-center justify-center transition-opacity duration-500 ${
            splashFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`w-full max-w-[744px] px-5 transition-all duration-1000 ${
              splashVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="relative flex items-center justify-center mx-10 text-3xl font-bold text-[#ffffff] min-[390px]:text-[#ff6155] leading-tight">
              <span className="shrink-0">잇</span>
              <span
                className="flex-1 h-1 bg-[#ffffff] min-[390px]:bg-[#ff6155] mx-3 overflow-hidden"
                style={
                  splashVisible
                    ? { animation: 'line-expand 0.8s ease-in 1.1s both' }
                    : undefined
                }
              />
              <span className="shrink-0">다</span>
            </h1>
          </div>
        </div>
      )}

      <HomeHeader onLogoClick={handleLogoClick} />
      <div className="p-5 flex flex-col gap-6 min-[744px]:gap-10 mt-11 mb-10">
        <Link
          href="/about"
          className="block relative -mx-5 w-[calc(100%+2.5rem)] aspect-350/200 overflow-hidden"
        >
          <Image
            src="https://res.cloudinary.com/ddedslqvv/image/upload/v1770690901/febc15-final04-ecad/E6MEBL6ui.jpg"
            alt="잇다 소개 배너"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <p className="text-display-6 font-semibold leading-tight">
              우리 동네 주부님의
              <br />
              정성 가득 집밥 한 끼
            </p>
            <p className="text-paragraph mt-1 text-white/80">
              잇-다 이야기 보러가기
            </p>
          </div>
        </Link>

        <div>
          <p className="text-display-5 font-semibold pb-4">오늘의 추천 반찬</p>
          <div className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <RecommendProductSkeleton key={i} />
                ))}
              </>
            ) : (
              recommendProducts.map((product) => (
                <RecommendProduct key={product._id} product={product} />
              ))
            )}
          </div>
        </div>

        <div className="mb-1">
          <p className="text-display-5 font-semibold pb-4">
            오늘의 추천 주부님
          </p>

          {isLoading ? (
            <RecommendSellerSkeleton />
          ) : recommendSeller ? (
            <>
              <Link
                href={`/sellers/${recommendSeller._id}`}
                className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide"
              >
                {recommendSeller.topDishes.map((dish, index) => (
                  <div
                    key={index}
                    className="relative shrink-0 w-28 h-28 overflow-hidden"
                  >
                    <Image
                      src={dish.imageSrc}
                      alt={dish.name}
                      fill
                      sizes="112px"
                      unoptimized
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
                {[
                  ...Array(Math.max(0, 6 - recommendSeller.topDishes.length)),
                ].map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="relative shrink-0 overflow-hidden w-28 h-28"
                  >
                    <Image
                      src="/food2.png"
                      alt="음식"
                      fill
                      sizes="112px"
                      unoptimized
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Link>

              <SellerProfileClear
                sellerId={recommendSeller._id}
                sellerName={recommendSeller.name}
                rating={recommendSeller.rating}
                reviewCount={recommendSeller.reviewCount}
                profileImage={
                  recommendSeller.extra?.profileImage ??
                  recommendSeller.image ??
                  '/seller/seller1.png'
                }
                description={
                  recommendSeller.extra?.description ??
                  recommendSeller.extra?.intro ??
                  '정성스럽게 만든 집밥을 나눕니다.'
                }
              />
            </>
          ) : (
            <p className="text-center text-gray-500 py-4">
              추천 주부가 없습니다.
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 -mx-5 sm:grid-cols-3 sm:gap-2.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${Math.floor(i / 2) > 0 ? 'border-t border-gray-200' : ''}`}
              >
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 -mx-5 sm:grid-cols-3 sm:gap-2.5 ">
            {filteredProducts.map((product, index) => {
              const reviewCount = Array.isArray(product.replies)
                ? product.replies.length
                : typeof product.replies === 'number'
                  ? product.replies
                  : 0;

              const colCount = 2;
              const rowIndex = Math.floor(index / colCount);

              return (
                <div
                  key={product._id}
                  className={`${rowIndex > 0 ? 'border-t border-gray-200' : ''}`}
                >
                  <ProductCard
                    productId={product._id}
                    imageSrc={product.mainImages?.[0]?.path ?? '/food1.png'}
                    chefName={`${product.seller?.name ?? '주부'}`}
                    tier={getTier(product.seller?.totalSales ?? 0).label}
                    dishName={product.name}
                    rating={product.rating ?? 0}
                    reviewCount={reviewCount}
                    price={product.price}
                    initialWished={Boolean(product.myBookmarkId)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="fixed bottom-20 z-50 w-full max-w-186 left-1/2 -translate-x-1/2 pointer-events-none">
        <button
          type="button"
          onClick={() => ChannelService.showMessenger()}
          className="absolute right-2 min-[744px]:right-3 bottom-0 pointer-events-auto bg-white w-12 h-12 rounded-2xl shadow flex items-center justify-center"
        >
          <Image src="/Message.svg" alt="채널톡 문의" width={28} height={28} />
        </button>
      </div>
      <BottomNavigation />
    </>
  );
}
