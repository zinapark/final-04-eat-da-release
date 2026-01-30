"use client";

import { BanchanItem, banchanList } from "@/app/mypage/banchan/BanchanData";
import PurchaseCard from "@/app/mypage/purchases/PurchaseCard";
import Link from "next/link";

export default function PurchasesClient() {
  const items = banchanList.items;

  const groupedByDate = items.reduce(
    (noTime: Record<string, BanchanItem[]>, item) => {
      const date = new Date(item.createdAt).toLocaleDateString("ko-KR"); // 날짜만
      if (!noTime[date]) noTime[date] = [];
      noTime[date].push(item);
      return noTime;
    },
    {},
  );

  return (
    <section className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
      {Object.entries(groupedByDate).length ? (
        Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <div className="py-4 flex justify-between border-b-[0.5px] border-gray-600">
              <p className=" font-semibold text-gray-800 text-display-2 ">
                {date}
              </p>
              <Link
                href={`/mypage/purchases/${items[0]._id}`}
                className="flex items-center gap-3"
              >
                <p className="text-display-2 text-gray-800">주문상세</p>
                <svg
                  width="5"
                  height="10"
                  viewBox="0 0 5 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5 0.5L4.5 5L0.5 9.5"
                    stroke="#353E5C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Link>
            </div>
            <div className="flex flex-col gap-4 py-5">
              {items.map((item) => (
                <PurchaseCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-1 flex-col gap-6 items-center justify-center">
          <div className="text-center gap-2 text-gray-600">
            <p>구매 내역이 없습니다.</p>
            <p>오늘의 식탁을 채워줄 동네 반찬을 만나보세요.</p>
          </div>
          <Link href="/products">
            <button className="px-5 py-3 bg-gray-200 border border-gray-300 text-display-1 rounded-lg">
              반찬 둘러보기
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}
