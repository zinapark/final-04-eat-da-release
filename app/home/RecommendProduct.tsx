import HeartItem from '@/app/src/components/ui/HeartItem';
import Image from 'next/image';
import { Product } from '@/app/src/types';
import Link from 'next/link';

interface RecommendProductProps {
  product: Product;
}

export default function RecommendProduct({ product }: RecommendProductProps) {
  return (
    <Link href={`/products/${product._id}`} className="shrink-0 w-28">
      <div className="relative aspect-square">
        <Image
          src={product.mainImages?.[0]?.path || '/food1.png'}
          fill
          alt={product.name}
          className="object-cover rounded-lg"
        />
        <HeartItem
          className="absolute top-0.5 right-0"
          lineColor="white"
          initialWished={Boolean(product.myBookmarkId)}
        />
      </div>
      <div className="pt-2 px-1">
        <div className="flex items-center">
          <p className="text-eatda-orange text-display-1 font-semibold">
            {product.seller?.name || '주부'} 주부
          </p>
        </div>
        <p className="text-paragraph-sm mr-2 truncate">{product.name}</p>
        <p className="text-paragraph-md font-semibold">
          {product.price.toLocaleString()}원
        </p>
      </div>
    </Link>
  );
}
