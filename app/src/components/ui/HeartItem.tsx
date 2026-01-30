"use client";
import { HeartProps, WishButtonProps } from "@/app/src/types";
import { useState } from "react";

const FilledHeart = ({ size = 20 }: HeartProps) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 20 18" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.81874 2.72467C8.01936 0.646974 5.01873 0.0880758 2.76417 1.99063C0.509631 3.89318 0.192224 7.07412 1.96273 9.32436L9.81874 16.8262L17.6748 9.32436C19.4454 7.07412 19.1667 3.87317 16.8734 1.99063C14.58 0.108095 11.6182 0.646974 9.81874 2.72467Z"
      fill="#FF6155"
      stroke="#FF6155"
      strokeWidth="1.64966"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmptyHeart = ({
  color,
  size = 20,
}: {
  color: "white" | "black";
  size?: number;
}) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 20 18" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.81874 2.72467C8.01936 0.646974 5.01873 0.0880757 2.76417 1.99063C0.509631 3.89318 0.192224 7.07412 1.96273 9.32436L9.81874 16.8262L17.6748 9.32436C19.4454 7.07412 19.1667 3.87317 16.8734 1.99063C14.58 0.108095 11.6182 0.646974 9.81874 2.72467Z"
      stroke={color}
      strokeWidth="1.64966"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HeartItem({
  initialWished = false,
  lineColor = "black",
  size = 20,
  className = "",
  onToggle,
}: WishButtonProps) {
  const [isWished, setIsWished] = useState(initialWished);

  const handleClick = () => {
    const newWishedState = !isWished;
    setIsWished(newWishedState);

    if (onToggle) {
      onToggle(newWishedState);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 hover:scale-110 transition-transform ${className}`}
    >
      {isWished ? (
        <FilledHeart size={size} />
      ) : (
        <EmptyHeart color={lineColor} size={size} />
      )}
    </button>
  );
}
