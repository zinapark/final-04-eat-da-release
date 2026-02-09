'use client';

import HomeHeader from '@/app/home/HomeHeader';
import RecommendProduct from '@/app/home/RecommendProduct';
import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import SellerProfileClear from '@/app/src/components/ui/SellerProfileClear';
import ProductCard from '@/app/src/components/ui/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAxios } from '@/lib/axios';
import { Product, Seller, SellerWithStats } from '@/app/src/types';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { getTier } from '@/lib/tier';


const RecommendProductSkeleton = () => (
  <div className="shrink-0 w-28 animate-pulse">
    <div className="w-28 h-28 bg-gray-200 rounded-lg mb-2" />
    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

const RecommendSellerSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="shrink-0 w-28 h-28 bg-gray-200 rounded-lg" />
      ))}
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="w-16 h-16 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="p-2 animate-pulse">
    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

export default function HomePageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);
  const [recommendSeller, setRecommendSeller] =
    useState<SellerWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

              if (sellerProductCount >= 3) {
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
            return productCount >= 3;
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
      <HomeHeader />
      <div className="p-5 flex flex-col gap-6 mt-12 mb-10">
        <Link href="/about">
          <Image src="/Hero.png" alt="banner" height={460} width={350} />
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

        <div className="border-b-[0.5px] border-gray-400 pb-4">
          <p className="text-display-5 font-semibold pb-4">
            오늘의 추천 주부님
          </p>

          {isLoading ? (
            <RecommendSellerSkeleton />
          ) : recommendSeller ? (
            <>
              <div className="flex gap-1 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                {recommendSeller.topDishes.map((dish, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-28 h-28 overflow-hidden"
                  >
                    <Image
                      src={dish.imageSrc}
                      alt={dish.name}
                      width={120}
                      height={120}
                      sizes="50vw"
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                ))}
                {[
                  ...Array(Math.max(0, 6 - recommendSeller.topDishes.length)),
                ].map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="shrink-0 overflow-hidden w-28 h-28"
                  >
                    <Image
                      src="/food2.png"
                      alt="음식"
                      width={120}
                      height={120}
                      sizes="50vw"
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                ))}
              </div>

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
          <div className="grid grid-cols-2 -mx-5 sm:grid-cols-3 md:grid-cols-4 sm:gap-2.5 md:gap-1">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 -mx-5 sm:grid-cols-3 md:grid-cols-4 sm:gap-2.5 md:gap-1">
            {products.map((product) => {
              const reviewCount = Array.isArray(product.replies)
                ? product.replies.length
                : typeof product.replies === 'number'
                  ? product.replies
                  : 0;

              return (
                <ProductCard
                  key={product._id}
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
