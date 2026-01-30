"use client";

const CATEGORIES = [
  "전체",
  "메인반찬",
  "국물",
  "찜",
  "볶음",
  "조림",
  "튀김",
  "밑반찬",
] as const;

export type CategoryLabel = (typeof CATEGORIES)[number];

interface CategoryTabsProps {
  value: CategoryLabel;
  onChange: (next: CategoryLabel) => void;
}

export default function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="fixed top-15 z-10 bg-white border-b-[0.5px] border-gray-300 flex h-10 items-center gap-7.5 overflow-x-auto px-5 scrollbar-hide text-paragraph">
      {CATEGORIES.map((category) => {
        const isSelected = value === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={[
              "relative shrink-0 overflow-hidden transition-colors",
              isSelected
                ? "font-bold text-eatda-orange"
                : "font-medium text-gray-700",
            ].join(" ")}
            aria-pressed={isSelected}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
