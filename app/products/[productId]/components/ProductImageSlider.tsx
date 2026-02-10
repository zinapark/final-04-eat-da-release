'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProductImageSliderProps {
  images: string[];
}

export default function ProductImageSlider({
  images,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex + 1);
  };

  return (
    <div className="relative w-full aspect-square">
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`반찬 이미지 ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지 인디케이터 (1 / 8) - 이미지가 2장 이상일 때만 표시 */}
      {images.length > 1 && (
        <div className="absolute right-5 bottom-5 z-10 flex justify-center items-center px-2 py-2 gap-1 w-auto h-6 bg-black/40 rounded-full">
          <span className="text-paragraph-sm font-regular text-white leading-4">
            {currentIndex} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
