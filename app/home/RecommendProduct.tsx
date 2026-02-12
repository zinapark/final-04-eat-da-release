'use client';

import HeartItem from '@/app/src/components/ui/HeartItem';
import Image from 'next/image';
import { Product } from '@/app/src/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAxios } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import useUserStore from '@/zustand/userStore';

interface RecommendProductProps {
  product: Product;
}

export default function RecommendProduct({ product }: RecommendProductProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [currentBookmarkId, setCurrentBookmarkId] = useState<
    number | undefined
  >(product.myBookmarkId);
  const [isWished, setIsWished] = useState(Boolean(product.myBookmarkId));

  useEffect(() => {
    setIsWished(Boolean(product.myBookmarkId));
    setCurrentBookmarkId(product.myBookmarkId);
  }, [product.myBookmarkId]);

  const handleBookmarkToggle = async (isWished: boolean) => {
    // 로그인 체크 - zustand의 user 상태 확인
    if (!user || !user.token?.accessToken) {
      // 로그인하지 않은 경우
      // 1. 현재 상품 정보를 localStorage에 저장
      const pendingWishItem = {
        productId: product._id,
        timestamp: Date.now(),
      };
      localStorage.setItem('pendingWishItem', JSON.stringify(pendingWishItem));

      // 2. 로그인 페이지로 리다이렉트
      router.push('/login?redirect=wishlist');
      return;
    }

    // 로그인한 경우 기존 로직 실행
    try {
      const axios = getAxios();

      if (isWished) {
        const response = await axios.post(`/bookmarks/product`, {
          target_id: product._id,
        });
        setCurrentBookmarkId(response.data.item._id);
        console.log('북마크 추가 성공');
      } else {
        if (currentBookmarkId) {
          await axios.delete(`/bookmarks/${currentBookmarkId}`);
          setCurrentBookmarkId(undefined);
          console.log('북마크 삭제 성공');
        }
      }
    } catch (error) {
      console.error('북마크 에러:', error);

      // 401 에러(인증 실패)인 경우 로그인 페이지로
      if ((error as any)?.response?.status === 401) {
        const pendingWishItem = {
          productId: product._id,
          timestamp: Date.now(),
        };
        localStorage.setItem(
          'pendingWishItem',
          JSON.stringify(pendingWishItem)
        );
        router.push('/login?redirect=wishlist');
      }
    }
  };

  return (
    <div className="shrink-0 w-28">
      <Link
        href={`/products/${product._id}`}
        className="relative block aspect-square"
      >
        <Image
          src={product.mainImages?.[0]?.path || '/food1.png'}
          fill
          sizes="50vw"
          alt={product.name}
          className="object-cover rounded-lg"
        />
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-0.5 right-0 z-10"
        >
          <HeartItem
            lineColor="white"
            initialWished={isWished}
            onToggle={handleBookmarkToggle}
          />
        </div>
      </Link>
      <Link href={`/products/${product._id}`} className="block pt-2 px-1">
        <div className="flex items-center">
          <p className="text-eatda-orange text-display-1 font-semibold">
            {product.seller?.name || '주부'} 주부
          </p>
        </div>
        <p className="text-paragraph-sm mr-2 truncate">{product.name}</p>
        <p className="text-paragraph-md font-semibold">
          {product.price.toLocaleString()}원
        </p>
      </Link>
    </div>
  );
}
