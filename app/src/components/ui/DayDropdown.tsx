"use client";

import { useState, useRef, useEffect } from "react";

interface DayOption {
  value: string;
  label: string;
}

const dayOptions: DayOption[] = [
  { value: "monday", label: "월요일" },
  { value: "tuesday", label: "화요일" },
  { value: "wednesday", label: "수요일" },
  { value: "thursday", label: "목요일" },
  { value: "friday", label: "금요일" },
];

interface DayDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export default function DayDropdown({
  value,
  onChange,
  onBlur,
  error,
}: DayDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    dayOptions.find((o) => o.value === value)?.label || "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => {
              if (prev) onBlur?.();
              return !prev;
            });
          }}
          className={`w-full py-2 border-b-[0.5px] border-gray-400 text-display-2 bg-transparent focus:outline-none text-left cursor-pointer ${value ? "text-gray-800" : "text-gray-500"}`}
        >
          {selectedLabel || "요일을 선택해주세요"}
        </button>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke={isOpen ? "#9CA3AF" : "#ff6155"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {isOpen && (
          <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 max-h-60 overflow-y-auto">
            {dayOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-display-2 hover:bg-gray-100 cursor-pointer ${
                    value === option.value
                      ? "text-eatda-orange font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="text-x-small text-eatda-orange mt-1">{error}</p>
      )}
    </div>
  );
}
