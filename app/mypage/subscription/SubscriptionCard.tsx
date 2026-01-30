interface SubscriptionCardProps {
  id: string;
  title: string;
  description: string;
  frequency: string;
  portions: string;
  price: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function SubscriptionCard({
  title,
  description,
  frequency,
  portions,
  price,
  isSelected,
  onClick,
}: SubscriptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-5 rounded-lg border text-left transition-colors ${
        isSelected
          ? "border-eatda-orange outline outline-eatda-orange"
          : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex justify-between items-start mb-5">
        <div className="">
          {/* 구독 종류 제목 */}
          <h3 className="font-semibold text-gray-800 text-display-3 mb-3">
            {title}
          </h3>
          {/* 구독 설명 */}
          <p className="text-display-1 text-gray-800">{description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center text-display-1 text-gray-800">
          {/* 주간 횟수 */}
          <span className="px-3 py-1.5 bg-gray-200 border-gray-300 border-[0.5px] text-nowrap rounded-4xl">
            {frequency}
          </span>
          {/* 반찬 종류 수 */}
          <span className="text-nowrap">{portions}</span>
        </div>
        {/* 가격 */}
        <div className="flex items-baseline text-nowrap">
          <span className="text-x-small text-gray-500 mr-1">주당</span>
          <span className="text-display-4 font-semibold text-eatda-orange">
            {price.toLocaleString()}원
          </span>
        </div>
      </div>
    </button>
  );
}
