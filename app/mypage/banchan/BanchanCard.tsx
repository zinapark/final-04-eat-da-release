import Image from "next/image";
import Link from "next/link";
import { BanchanItem } from "./BanchanData";

interface BanchanCardProps {
  item: BanchanItem;
}

// 반찬 상태 계산 함수
const getBanchanStatus = (item: BanchanItem): string => {
  if (item.show === false) return "판매중지";
  if (item.quantity === 0) return "품절";
  return "판매중";
};

export default function BanchanCard({ item }: BanchanCardProps) {
  const status = getBanchanStatus(item);
  const price = item.price.toLocaleString();
  const imagePath = item.mainImages[0]?.path;
  const imgSrc = imagePath || null;

  return (
    <Link
      href={`/mypage/banchan/${item._id}/edit`}
      className="flex border-b-[0.5px] border-gray-400 py-5 gap-5 cursor-pointer hover:bg-gray-100"
    >
      {/* 이미지 영역 */}
      <div className="w-17.5 h-17.5 shrink-0 rounded-lg bg-gray-200 border-[0.5px] border-gray-300 overflow-hidden">
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={item.name}
            width={70}
            height={70}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 정보 영역 */}
      <div className=" flex-1 flex flex-col gap-1">
        <div className="flex justify-between ">
          {/* 반찬명 및 가격*/}
          <div className="flex flex-col">
            <h3 className="text-display-2 font-semibold text-gray-800">
              {item.name}
            </h3>
            <p className="text-display-2 text-gray-600">{price}원</p>
          </div>

          {/* 상태 */}
          <span
            className={`text-display-2 font-semibold ${status === "판매중" ? "text-eatda-orange" : "text-gray-500"}`}
          >
            {status}
          </span>
        </div>

        {/* 수량 정보 */}
        <p className="text-display-1 text-gray-600">
          최대 주문 수량 : {item.quantity}개
        </p>
      </div>
    </Link>
  );
}
