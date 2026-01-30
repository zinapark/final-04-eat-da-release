"use client";

import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import Header from "@/app/src/components/common/Header";
import PurchaseProductItem from "@/app/src/components/ui/PurchaseProductItem";
import { CartItemType, CartResponse } from "@/app/src/types";
import { getAxios } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export default function CheckoutPageClient() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cost, setCost] = useState<CartResponse["cost"] | null>(null);
  const searchParams = useSearchParams();
  const isDirect = searchParams.get("direct") === "true";

  const tomorrow = dayjs().add(1, "day");
  const after_tomorrow = dayjs().add(2, "day");

  useEffect(() => {
    const fetchCart = async () => {
      const axios = getAxios();
      const response = await axios.get<CartResponse>("/carts");
      setCartItems(response.data.item);
      setCost(response.data.cost);
    };
    fetchCart();
  }, []);

  const handlePurchase = async () => {
    if (!selectedDate || !selectedTime) {
      alert("픽업 날짜와 시간을 선택해주세요.");
      return;
    }

    try {
      const axios = getAxios();

      const pickupDateValue =
        selectedDate === "tomorrow"
          ? tomorrow.format("YYYY-MM-DD")
          : after_tomorrow.format("YYYY-MM-DD");

      const orderData = {
        products: cartItems.map((item) => ({
          _id: item.product._id,
          quantity: item.quantity,
        })),
        extra: {
          pickupDate: pickupDateValue,
          pickupTime: selectedTime,
        },
      };
      const response = await axios.post("/orders", orderData);
      // 바로 구매인 경우에만 localStorage 정리
      if (isDirect) {
        localStorage.removeItem("directPurchase");
      } else {
        // 장바구니에서 구매한 경우에만 장바구니 비우기
        await axios.delete("/carts/cleanup");
      }

      router.push(`/checkout/complete?orderId=${response.data.item._id}`);
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Header title="구매하기" showBackButton={true} />

      <div className="p-5 space-y-5 mt-15 mb-16">
        <div>
          <button
            onClick={() => setIsProductInfoOpen(!isProductInfoOpen)}
            className={`w-full flex justify-between items-center ${!isProductInfoOpen ? "pb-5 border-b-[0.5px] border-gray-600" : ""}`}
          >
            <p className="text-display-3 font-semibold">구매 상품 정보</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`transition-transform ${
                isProductInfoOpen ? "rotate-180" : ""
              }`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#353E5C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isProductInfoOpen && (
            <div className="space-y-4 pt-3 pb-3">
              {cartItems.map((item) => (
                <PurchaseProductItem
                  key={item._id}
                  imageSrc={item.product.image.path}
                  dishName={item.product.name}
                  chefName={item.product.seller.name}
                  price={item.product.price}
                  quantity={item.quantity}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-display-3 font-semibold">픽업 장소</p>
          <div className="flex gap-1 p-5 bg-gray-200 border border-gray-300 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M15.2104 8.24042C15.2104 12.3784 9.21045 16.7749 9.21045 16.7749C9.21045 16.7749 3.21045 12.3784 3.21045 8.24042C3.21045 4.61973 6.02929 1.7749 9.21045 1.7749C12.3916 1.7749 15.2104 4.61973 15.2104 8.24042Z"
                fill="#FF6155"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.21045 6.2749C8.38202 6.2749 7.71045 6.94648 7.71045 7.7749C7.71045 8.60333 8.38202 9.2749 9.21045 9.2749C10.0389 9.2749 10.7104 8.60333 10.7104 7.7749C10.7104 6.94648 10.0389 6.2749 9.21045 6.2749ZM6.21045 7.7749C6.21045 6.11805 7.55359 4.7749 9.21045 4.7749C10.8673 4.7749 12.2104 6.11805 12.2104 7.7749C12.2104 9.43176 10.8673 10.7749 9.21045 10.7749C7.55359 10.7749 6.21045 9.43176 6.21045 7.7749Z"
                fill="white"
              />
            </svg>
            <div>
              <p className="text-paragraph font-semibold">서교동 공유주방</p>
              <p className="text-paragraph-sm">서울시 마포구 동교로 15길</p>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 날짜</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            픽업할 날짜를 선택해주세요
          </p>
          <div className="flex gap-2.5 w-full">
            <button
              onClick={() => setSelectedDate("tomorrow")}
              className={`flex-1 py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedDate === "tomorrow"
                  ? "shadow-[inset_0_0_0_2px_#FF6155]"
                  : ""
              }`}
            >
              <p className="text-paragraph font-semibold">내일</p>
              <p className="text-paragraph-sm">
                {tomorrow.format("M월 D일 dddd")}
              </p>
            </button>
            <button
              onClick={() => setSelectedDate("after_tomorrow")}
              className={`flex-1 py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedDate === "after_tomorrow"
                  ? "shadow-[inset_0_0_0_2px_#FF6155]"
                  : ""
              }`}
            >
              <p className="text-paragraph font-semibold">모레</p>
              <p className="text-paragraph-sm">
                {after_tomorrow.format("M월 D일 dddd")}
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-display-3 font-semibold">픽업 시간</h2>
          <p className="text-x-small text-eatda-orange mb-4">
            픽업할 시간을 선택해주세요
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedTime("9-12")}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedTime === "9-12"
                  ? "shadow-[inset_0_0_0_2px_#FF6155]"
                  : ""
              }`}
            >
              9:00 - 12:00
            </button>
            <button
              onClick={() => setSelectedTime("12-16")}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedTime === "12-16"
                  ? "shadow-[inset_0_0_0_2px_#FF6155]"
                  : ""
              }`}
            >
              12:00 - 16:00
            </button>
            <button
              onClick={() => setSelectedTime("16-20")}
              className={`w-full py-4 px-5 border border-gray-300 rounded-lg transition-shadow ${
                selectedTime === "16-20"
                  ? "shadow-[inset_0_0_0_2px_#FF6155]"
                  : ""
              }`}
            >
              16:00 - 20:00
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-display-3 font-semibold">결제 정보</h2>
          <div className="flex justify-between">
            <p className="text-paragraph">상품 금액</p>
            <p className="text-paragraph text-gray-600">
              {cost?.products.toLocaleString() || "0"}원
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-paragraph">수량</p>
            <p className="text-paragraph text-gray-600">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}개
            </p>
          </div>
          <div className="flex justify-between pb-1">
            <p className="text-paragraph">쿠폰</p>
            <p className="text-paragraph text-gray-600">사용안함</p>
          </div>
          <div className="flex justify-between border-t-[0.5px] border-gray-600 pt-4">
            <h2 className="text-paragraph-md font-semibold">총 결제 금액</h2>
            <p className="text-paragraph-md font-semibold text-eatda-orange">
              {cost?.total.toLocaleString() || "0"}원
            </p>
          </div>
        </div>

        <div className="p-5 text-paragraph-sm bg-gray-200 border border-gray-300 rounded-lg">
          <p className="text-paragraph font-semibold mb-2">안내사항</p>
          <p>• 선택하신 시간에 픽업 장소로 방문해주세요.</p>
          <p>• 픽업 시간이 지나면 자동으로 취소될 수 있습니다.</p>
          <p>• 결제 후 변경 및 취소는 픽업 2시간 전까지 가능합니다.</p>
          <p>• 음식은 위생적으로 포장되어 준비됩니다.</p>
          <p>
            • 본 상품은 주문 후 조리되는 반찬으로, 미수령 시 30%의 수수료가
            발생합니다.
          </p>
        </div>
      </div>

      <BottomFixedButton as="button" type="button" onClick={handlePurchase}>
        구매하기
      </BottomFixedButton>
    </>
  );
}
