"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface AddImageProps {
  onChange?: (images: string[], files: File[]) => void;
  maxImages?: number;
  initialImages?: string[];
  initialFiles?: File[];
  showLabel?: boolean; // 라벨 표시 여부 추가
}

export default function AddImage({
  onChange,
  maxImages = 20,
  initialImages = [],
  initialFiles = [],
  showLabel = true, // 기본값 true (기존 동작 유지)
}: AddImageProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // initialImages prop 변경 시 내부 state 동기화
  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // 가로 스크롤 (마우스 휠)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // 이미지 추가 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시 이미지 미리보기 추가
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newImages: string[] = [];
    const newFiles: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const imageUrl = URL.createObjectURL(selectedFiles[i]);
      newImages.push(imageUrl);
      newFiles.push(selectedFiles[i]);
    }

    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    const updatedFiles = [...files, ...newFiles].slice(0, maxImages);
    setImages(updatedImages);
    setFiles(updatedFiles);
    onChange?.(updatedImages, updatedFiles);
  };

  // 이미지 삭제
  const handleImageRemove = (index: number) => {
    URL.revokeObjectURL(images[index]); // 메모리 해제
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedFiles = files.filter((_, i) => i !== index);
    setImages(updatedImages);
    setFiles(updatedFiles);
    onChange?.(updatedImages, updatedFiles);
  };

  return (
    <div>
      {/* showLabel이 true일 때만 라벨 표시 */}
      {showLabel && (
        <label className="text-display-2 font-semibold text-gray-800">
          반찬 이미지 등록 <span className="text-eatda-orange">*</span>
        </label>
      )}
      {/* 파일 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <div ref={scrollContainerRef} className="flex gap-2.5 scrollbar-hide overflow-x-auto overflow-y-visible py-2">
        {/* 등록된 이미지 미리보기 */}
        {images.map((imageUrl, index) => (
          <div key={index} className="w-17.5 h-17.5 shrink-0 relative">
            <img
              src={imageUrl}
              alt={`반찬 이미지 ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => handleImageRemove(index)}
              className="absolute -top-2 -right-2"
              aria-label={`이미지 ${index + 1} 삭제`}
            >
              <Image
                src="/deleteCircle.svg"
                alt="삭제"
                width={18}
                height={18}
              />
            </button>
          </div>
        ))}
        {/* 이미지 추가 버튼 */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleImageButtonClick}
            className="w-17.5 h-17.5 rounded-lg shrink-0 bg-gray-200 border-[0.5px] border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400"
          >
            <Image
              src="/PlusOrange.svg"
              alt="이미지 추가"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>
      {/* 최대 이미지 개수 도달 시 안내 메시지 */}
      {images.length >= maxImages && (
        <p className="text-display-1 text-eatda-orange">
          이미지는 최대 {maxImages}장까지 등록 가능합니다.
        </p>
      )}
    </div>
  );
}
