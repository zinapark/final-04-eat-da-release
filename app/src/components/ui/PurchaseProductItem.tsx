import { CheckoutProductItemProps } from "@/app/src/types";
import Image from "next/image";

export default function PurchaseProductItem({
  imageSrc,
  dishName,
  chefName,
  price,
  quantity,
}: CheckoutProductItemProps) {
  return (
    <div className="flex gap-5 pb-3.5 border-b-[0.5px] border-gray-400">
      <Image
        src={imageSrc}
        alt={dishName}
        width={55}
        height={55}
        className="rounded-lg"
      />
      <div className="flex flex-col gap-0.5">
        <p className="text-paragraph-sm">{dishName}</p>
        <p className="text-x-small text-gray-600">{chefName} 주부</p>
        <div className="flex gap-1">
          <p className="text-x-small text-eatda-orange">
            {price.toLocaleString()}원
          </p>
          <p className="text-x-small text-gray-400">|</p>
          <p className="text-x-small">수량 {quantity}개</p>
        </div>
      </div>
    </div>
  );
}
