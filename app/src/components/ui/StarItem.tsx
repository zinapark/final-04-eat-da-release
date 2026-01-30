'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  editable?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 40,
  editable = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editable && onRatingChange(star)}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
          className={`transition-transform ${editable ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          disabled={!editable}
        >
          <Image
            src={star <= (hoverRating || rating) ? "/filledStar.svg" : "/emptyStar.svg"}
            alt={`${star}점`}
            width={size}
            height={size}
            priority
          />
        </button>
      ))}
    </div>
  );
}