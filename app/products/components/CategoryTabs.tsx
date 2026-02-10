'use client';

import { useEffect, useRef, useState } from 'react';

const CATEGORIES = [
  '전체',
  '메인반찬',
  '국물',
  '찜',
  '볶음',
  '조림',
  '튀김',
  '밑반찬',
] as const;

export type CategoryLabel = (typeof CATEGORIES)[number];

interface CategoryTabsProps {
  value: CategoryLabel;
  onChange: (next: CategoryLabel) => void;
}

export default function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const btn = buttonRefs.current.get(value);
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setIndicator({
      left: btnRect.left - containerRect.left + container.scrollLeft,
      width: btnRect.width,
    });
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="fixed top-15 z-20 bg-white shadow-[inset_0_-0.5px_0_0_rgb(209,213,219)] flex h-10 w-full max-w-186 min-[464px]:gap-0 overflow-x-auto min-[464px]:px-0 scrollbar-hide text-paragraph"
    >
      {CATEGORIES.map((category) => {
        const isSelected = value === category;

        return (
          <button
            key={category}
            ref={(el) => {
              if (el) buttonRefs.current.set(category, el);
            }}
            type="button"
            onClick={() => onChange(category)}
            className={[
              'h-full shrink-0 w-16 min-[464px]:w-auto min-[464px]:shrink min-[464px]:flex-1 flex items-center justify-center transition-colors',
              isSelected
                ? 'font-bold text-eatda-orange'
                : 'font-medium text-gray-700',
            ].join(' ')}
            aria-pressed={isSelected}
          >
            {category}
          </button>
        );
      })}

      <span
        className="absolute bottom-0 h-0.5 bg-eatda-orange transition-all duration-300 ease-in-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
