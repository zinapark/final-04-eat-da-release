"use client";
import Image from "next/image";
import HeartItem from "./HeartItem";
import Link from "next/link";
import { getAxios } from "@/lib/axios";
import { useState } from "react";
import { ProductCardProps } from "@/app/src/types";

export default function ProductCard({
  productId,
  imageSrc,
  chefName,
  dishName,
  rating,
  reviewCount,
  price,
  initialWished = false,
  bookmarkId,
  isLcp = false,
  onBookmarkChange,
}: ProductCardProps) {
  const safeImageSrc = imageSrc || "/food1.png";
  const [currentBookmarkId, setCurrentBookmarkId] = useState(bookmarkId);

  const handleToggleWish = async (isWished: boolean) => {
    try {
      const axios = getAxios();

      if (isWished) {
        const response = await axios.post(`/bookmarks/product`, {
          target_id: productId,
        });
        setCurrentBookmarkId(response.data.item._id);
        console.log("북마크 추가 성공");
      } else {
        if (currentBookmarkId) {
          await axios.delete(`/bookmarks/${currentBookmarkId}`);
          setCurrentBookmarkId(undefined);
          console.log("북마크 삭제 성공");
        }
      }

      if (onBookmarkChange) {
        onBookmarkChange();
      }
    } catch (error) {
      console.error("북마크 에러:", error);
    }
  };

  return (
    <Link href={`/products/${productId}`} className="flex flex-col">
      <div className="relative w-full aspect-square">
        <Image
          src={safeImageSrc}
          fill
          alt={dishName}
          className="object-cover"
          sizes="50vw"
          loading={isLcp ? "eager" : "lazy"}
          priority={isLcp}
        />
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute bottom-2 right-1"
        >
          <HeartItem
            initialWished={initialWished}
            lineColor="white"
            size={25}
            onToggle={handleToggleWish}
          />
        </div>
      </div>
      <div className="pt-4 pb-5 px-2.5 space-y-1">
        <div className="flex gap-2 items-center">
          <p className="text-eatda-orange text-display-1 font-semibold">
            {chefName}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="5"
            height="8"
            viewBox="0 0 5 8"
            fill="none"
          >
            <path
              d="M0.49487 7.09351L3.79419 3.79419L0.49487 0.494873"
              stroke="#FF6155"
              strokeWidth="0.989796"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex items-center">
          <p className="text-paragraph mr-2">{dishName}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M13.2999 5.7447C13.2937 5.89309 13.2153 6.06256 13.063 6.1964C12.4536 6.73174 11.8439 7.26658 11.2338 7.80092C10.949 8.05086 10.6638 8.30041 10.3781 8.54956C10.3373 8.58503 10.3269 8.61648 10.3395 8.67152C10.5588 9.62967 10.7762 10.5882 10.9919 11.5471C11.0356 11.7399 11.0786 11.9329 11.1258 12.125C11.1945 12.4094 11.1067 12.6904 10.885 12.8495C10.6411 13.0245 10.3821 13.0359 10.1243 12.883C9.30315 12.3948 8.48302 11.9047 7.66394 11.4126C7.47272 11.2984 7.27917 11.1868 7.09113 11.0683C7.02822 11.0287 6.98255 11.0284 6.91798 11.0672C5.9219 11.6651 4.92366 12.2593 3.92876 12.8571C3.71746 12.9839 3.50165 13.0316 3.26811 12.9357C2.95912 12.8089 2.79768 12.484 2.87447 12.1464C3.09161 11.1908 3.3091 10.2352 3.52692 9.27964C3.57275 9.07888 3.61374 8.87662 3.66343 8.67738C3.67781 8.61983 3.66778 8.58587 3.62411 8.54789C3.24982 8.22233 2.87647 7.89566 2.50408 7.56788C1.98228 7.10983 1.45848 6.65495 0.939704 6.19355C0.72791 6.00551 0.647608 5.76545 0.734434 5.49092C0.82126 5.21639 1.01532 5.0511 1.30474 5.02132C1.81767 4.96879 2.33143 4.92479 2.84486 4.87778C3.35276 4.83127 3.86067 4.7851 4.36857 4.73926C4.53788 4.72404 4.70718 4.70697 4.87665 4.69409C4.93119 4.69008 4.9603 4.66615 4.9807 4.61647C5.44076 3.53541 5.90161 2.4548 6.36323 1.37463C6.49071 1.07601 6.71839 0.90922 7.00781 0.916748C7.29723 0.924276 7.50602 1.06564 7.62078 1.33147C7.93312 2.05469 8.24144 2.77957 8.55111 3.50413C8.7087 3.87217 8.66662 4.24123 9.02154 4.61095C9.04529 4.66783 9.07926 4.68991 9.13864 4.69459C9.54684 4.72917 9.95493 4.76542 10.3629 4.80334C10.9569 4.85732 11.5509 4.91174 12.1448 4.96662C12.3335 4.98334 12.5223 5.00007 12.7106 5.02115C13.0528 5.06164 13.3026 5.34721 13.2999 5.7447Z"
              fill="#FF6155"
            />
          </svg>
          <p className="text-x-small ml-1">
            {rating}({reviewCount})
          </p>
        </div>
        <p className="text-paragraph-md font-semibold">
          {price.toLocaleString()}원
        </p>
      </div>
    </Link>
  );
}
