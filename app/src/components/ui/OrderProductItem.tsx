import { OrderProductItemProps } from '@/app/src/types';
import Image from 'next/image';

export default function OrderProductItem({
  imageSrc,
  dishName,
  chefName,
  price,
}: OrderProductItemProps) {
  return (
    <div className="flex gap-5 border-b-[0.5px] border-gray-400 pb-5">
      <Image
        src={imageSrc}
        alt={dishName}
        width={70}
        height={70}
        className="rounded-lg w-17 h-17"
      />
      <div className="flex flex-col gap-1">
        <p className="text-paragraph font-semibold">{dishName}</p>
        <p className="text-x-small text-eatda-orange">{chefName} 주부</p>
        <p className="text-paragraph-sm font-semibold text-gray-600">
          {price.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
