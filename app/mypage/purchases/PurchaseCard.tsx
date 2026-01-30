// 티어 영역 구현 못함

import { BanchanItem } from "@/app/mypage/banchan/BanchanData";
import Image from "next/image";

interface PurchasesClientProps {
  item: BanchanItem;
}

export default function PurchaseCard({ item }: PurchasesClientProps) {
  const totalprice = (item.price * item.quantity).toLocaleString();
  const imgSrc =
    item.mainImages[0]?.path ||
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlwMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAQMEBQIG/8QAORAAAgECAwQFCwEJAAAAAAAAAAECAxEEBSESMUFREyJhc5IVNDVTVXGBobHB8DIUIzNDUnKR4fH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+0Kld2RD1ey04gQhSAACgQtj3Tkoyel7ok9lO0deb7QPAAAAFW/XcAtdPgQrd9ABAABRbt15BbzInFw2ZK1tW+L7AMdiFduG4AFoQACghQAAAXCIUAQoADXmCAUEKAAAAAgAAAACgAAAAAEBQwA4AACFAEKAAAAAhQBAABVvMijGUU1Lr8uRjLtNJpcd4EZCkAGfDYWtinJUYbWzvd7GA6eWSlHA46UW01C6a4aMDF5Kxi30l4kV5VjH/KXiRqdPW9dVXYps2KdPHVKDrU5VpQT4Td/+AevJOM9UvEh5Jxnql4ka3T17/wAer42eqVTE1akKcK1Vyk7LrsDP5Jxnql4kWOVYzaX7peJG5iMtxFOhKdPG1ZzirtOTSfzOSsRW9fV8bA255Ti79SKceLckamIoVcPU2K0dmVriWJr20r1dN3XZvZ95zS7tfUDmAoAFWmrWvAnvVyAVu+8EAAAAUEKAOll3o/H939mc06OXej8f3f2YGlh6MsRXhSp75O1+XafVUaUaFKFOmrRirI52R4ToqX7RNdap+nTdE6gGnjMuoYrrNKE/6orf7zjVcJiMvqxq2vGLupx3f6PpQ9U09z4AcPEZzKpQlCnS2JSVm73t7jn1MNWpU4VKlOUYTV4u2h3auU4apWjNXgk7ygt0jeaUouMopp6NW0A+Oe5nTz3zil3a+pmzXLKVOhUxFF7GyruHB+4wZ75xS7tAc4AACAAAAAAPSWuuiQEQHuAA6OX+jsw7v7M5p0csrYeFLEUcTNwjVVrpAd7D+b0tF+iP0MhyKU6LWzTzOu0louXyI61D2piPz4AdgHH6bD+1cR+fAdNh/auI/PgB2AcfpsP7VxH58B02H9q4n8+AG5m3o3Ef2nLz3zil3aM1SWGqwdOrmNaUHvT4/I1c3xFLEYiLoS2oxha9gNG4IUAQu89bHV27dXgB4BSAUMEAoAAhQAPUXaV7tc7EnLaeiSXIgAgKAIVc+PIABvAAEBQAWmp7jNxVt/K/A8AA3feCAAAABUAADAAgAAoAAEKQAAUAAABCkAAAAW1tOIWjVzJGS6PZmlZdurAxgMgApAAK1ZlWl+fAjAEAAoIVfTgA47wZKkoySdld8E9xjAEAApUv8cyfMX0AEAAqAAEAAAAAL8AAAAAAqAAEAAAACkAAAAD/2Q==";

  return (
    <div className="flex border-b-[0.5px] border-gray-400 pb-4 gap-5">
      {/* 이미지 영역 */}
      <div className="flex items-start rounded-lg">
        <Image
          src={imgSrc}
          alt={item.name}
          width={50}
          height={50}
          className="object-cover rounded-lg"
        />
      </div>

      {/* 정보 영역 */}
      <div className=" flex-1 flex flex-col">
        <div className="flex justify-between ">
          {/* 반찬명과 판매자 정보 */}
          <div className="flex flex-col">
            <p className="text-display-1 text-gray-800">{item.name}</p>
            <p className="text-x-small text-gray-600">
              {item.seller.name} 주부 9단
            </p>
          </div>
        </div>

        {/* 총 금액 및 수량 정보 */}
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-x-small text-eatda-orange">{totalprice}원</p>
          <svg
            width="1"
            height="10"
            viewBox="0 0 1 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0.25"
              y1="1.09279e-08"
              x2="0.25"
              y2="10"
              stroke="#D7DBE7"
              strokeWidth="0.5"
            />
          </svg>
          <p className="text-x-small text-gray-800">수량 {item.quantity}개</p>
        </div>
      </div>
    </div>
  );
}
