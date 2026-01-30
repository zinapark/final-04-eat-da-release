import PurchaseProductItem from "@/app/src/components/ui/PurchaseProductItem";

type OrderStatus = "대기중" | "승인됨" | "조리완료" | "픽업완료";

interface Product {
  imageSrc: string;
  dishName: string;
  chefName: string;
  price: number;
  quantity: number;
}

interface OrderCardProps {
  status: OrderStatus;
  orderTime: string;
  products: Product[];
  customerName: string;
  pickupDate: string;
  pickupTime: string;
}

const statusConfig = {
  대기중: { text: "주문 대기", bgColor: "#FBE080", textColor: "#000000" },
  승인됨: { text: "주문 승인", bgColor: "#81E492", textColor: "#000000" },
  조리완료: { text: "조리 완료", bgColor: "#4E9FFF", textColor: "#FFFFFF" },
  픽업완료: {
    text: "픽업 완료",
    bgColor: "rgba(255, 97, 85, 1)",
    textColor: "#FFFFFF",
  },
};

export default function OrderCard({
  status,
  orderTime,
  products,
  customerName,
  pickupDate,
  pickupTime,
}: OrderCardProps) {
  const { text, bgColor, textColor } = statusConfig[status];

  return (
    <div className="border p-5 flex flex-col gap-5 rounded-lg border-gray-300">
      <div className="flex justify-between border-b-[0.5px] border-gray-600 pb-4">
        <span
          className="text-paragraph-sm font-semibold px-3 py-1.5 rounded-3xl"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {text}
        </span>
        <p className="text-paragraph font-semibold">주문 시간: {orderTime}</p>
      </div>

      <div className="flex flex-col gap-4">
        {products.map((product, index) => (
          <PurchaseProductItem
            key={index}
            imageSrc={product.imageSrc}
            dishName={product.dishName}
            chefName={product.chefName}
            price={product.price}
            quantity={product.quantity}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-paragraph">주문자명</p>
          <p className="text-paragraph font-semibold">{customerName}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-paragraph">픽업 날짜</p>
          <p className="text-paragraph font-semibold">{pickupDate}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-paragraph">픽업 시간</p>
          <p className="text-paragraph font-semibold">{pickupTime}</p>
        </div>
      </div>
    </div>
  );
}
