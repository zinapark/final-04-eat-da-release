import type { PurchaseProduct } from '@/app/src/types';
import Image from 'next/image';

interface PurchaseCardProps {
  product: PurchaseProduct;
  quantity: number;
}

export default function PurchaseCard({ product, quantity }: PurchaseCardProps) {
  const totalprice = (product.price * quantity).toLocaleString();
  const imgSrc = product.image?.path;

  return (
    <div className="flex border-b-[0.5px] border-gray-400 pb-4 gap-5">
      {/* 이미지 영역 */}
      <div className="relative h-12.5 w-12.5 overflow-hidden items-start rounded-lg">
        <Image src={imgSrc} alt={product.name} fill className="object-cover" />
      </div>

      {/* 정보 영역 */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="text-display-1 text-gray-800">{product.name}</p>
            <p className="text-x-small text-gray-600">
              {product.seller.name} 주부
            </p>
          </div>
        </div>

        {/* 총 금액 및 수량 정보 */}
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-x-small text-eatda-orange">{totalprice}원</p>
          <Image src="/Divider.svg" alt="구분선" width={1} height={10} />
          <p className="text-x-small text-gray-800">수량 {quantity}개</p>
        </div>
      </div>
    </div>
  );
}
