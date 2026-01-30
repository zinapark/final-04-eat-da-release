interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const baseStyle =
    "px-3 py-1.5 rounded-full text-paragraph inline-block border-[0.5px] border-gray-300";

  const variantStyle = {
    default: "bg-gray-200 text-gray-700",
    outline: "border border-gray-300 text-gray-700 bg-white",
  };

  return (
    <span className={`${baseStyle} ${variantStyle[variant]} ${className}`}>
      {children}
    </span>
  );
}
