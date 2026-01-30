"use client";

interface GrayButtonProps {
  text: string;
  onClick?: () => void | Promise<void>;
}

export default function GrayButton({ text, onClick }: GrayButtonProps) {
  const buttonStyle =
    "w-full py-3 bg-gray-200 border border-gray-300 text-eatda-orange text-display-1 font-semibold rounded block text-center";

  return (
    <button onClick={onClick} className={buttonStyle}>
      {text}
    </button>
  );
}
