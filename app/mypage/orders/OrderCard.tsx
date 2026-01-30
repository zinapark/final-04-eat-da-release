import PurchaseProductItem from '@/app/src/components/ui/PurchaseProductItem';
import GrayButton from '@/app/src/components/ui/GrayButton';
import type { OrderStatus } from '@/app/src/types/orderManagement';

interface Product {
  imageSrc: string;
  dishName: string;
  sellerName: string;
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
  onAdvance?: () => void;
  nextStatusText?: string;
}

const statusConfig: Record<
  OrderStatus,
  { text: string; bgColor: string; textColor: string }
> = {
  대기중: { text: '대기중', bgColor: '#FBE080', textColor: '#000000' },
  승인됨: { text: '승인됨', bgColor: '#81E492', textColor: '#000000' },
  조리완료: { text: '조리완료', bgColor: '#4E9FFF', textColor: '#FFFFFF' },
  픽업완료: { text: '픽업완료', bgColor: '#FF6155', textColor: '#FFFFFF' },
};

export default function OrderCard({
  status,
  orderTime,
  products,
  customerName,
  pickupDate,
  pickupTime,
  onAdvance,
  nextStatusText,
}: OrderCardProps) {
  const { text, bgColor, textColor } = statusConfig[status];

  return (
    <div className="border p-5 flex flex-col gap-5 rounded-lg border-gray-300">
      <div className="flex justify-between items-center border-b-[0.5px] border-gray-600 pb-5">
        <span
          className="text-display-1 font-semibold px-3 py-1.5 rounded-3xl"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {text}
        </span>
        <p className="text-display-1 font-semibold">주문 시간: {orderTime}</p>
      </div>

      <div className="flex flex-col gap-4">
        {products.map((product, index) => (
          <PurchaseProductItem
            key={index}
            imageSrc={product.imageSrc}
            dishName={product.dishName}
            chefName={product.sellerName}
            price={product.price}
            quantity={product.quantity}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-display-2">주문자명</p>
          <p className="text-display-2 font-semibold">{customerName}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-display-2">픽업 날짜</p>
          <p className="text-display-2 font-semibold">{pickupDate}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-display-2">픽업 시간</p>
          <p className="text-display-2 font-semibold">{pickupTime}</p>
        </div>
      </div>

      {onAdvance && nextStatusText && (
        <GrayButton text={nextStatusText} onClick={onAdvance} />
      )}
    </div>
  );
}
