'use client';

import HeartItem from '@/app/src/components/ui/HeartItem';
import Image from 'next/image';
import { Product } from '@/app/src/types';
import Link from 'next/link';
import { useState } from 'react';
import { getAxios } from '@/lib/axios';

interface RecommendProductProps {
  product: Product;
}

export default function RecommendProduct({ product }: RecommendProductProps) {
  const [currentBookmarkId, setCurrentBookmarkId] = useState<
    number | undefined
  >(product.myBookmarkId);

  const handleBookmarkToggle = async (isWished: boolean) => {
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
            initialWished={Boolean(currentBookmarkId)}
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
