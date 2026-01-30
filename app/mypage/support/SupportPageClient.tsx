"use client";

import BottomNavigation from "@/app/src/components/common/BottomNavigation";
import { useState } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { useEffect } from "react";
import Image from "next/image";

ChannelService.loadScript();

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "반찬은 어떻게 주문하나요?",
    answer:
      "원하는 반찬을 선택한 후 '구매하기' 버튼을 눌러 픽업 날짜와 시간을 선택하고 결제하시면 됩니다. 장바구니에 여러 반찬을 담아 한 번에 주문하실 수도 있습니다.",
  },
  {
    question: "픽업은 어떻게 하나요?",
    answer:
      "주문 시 선택하신 날짜와 시간에 픽업 장소로 방문하시면 됩니다. 주문 확인 메시지를 보여주시면 반찬을 수령하실 수 있습니다.",
  },
  {
    question: "환불은 어떻게 하나요?",
    answer:
      "픽업 2시간 전까지 주문 내역에서 취소 가능하며, 결제하신 금액이 전액 환불됩니다. 그 이후에는 환불이 어려우니 양해 부탁드립니다.",
  },
  {
    question: "반찬은 어떻게 주문하나요?",
    answer:
      "원하는 반찬을 선택한 후 '구매하기' 버튼을 눌러 픽업 날짜와 시간을 선택하고 결제하시면 됩니다. 장바구니에 여러 반찬을 담아 한 번에 주문하실 수도 있습니다.",
  },
  {
    question: "픽업은 어떻게 하나요?",
    answer:
      "주문 시 선택하신 날짜와 시간에 픽업 장소로 방문하시면 됩니다. 주문 확인 메시지를 보여주시면 반찬을 수령하실 수 있습니다.",
  },
  {
    question: "환불은 어떻게 하나요?",
    answer:
      "픽업 2시간 전까지 주문 내역에서 취소 가능하며, 결제하신 금액이 전액 환불됩니다. 그 이후에는 환불이 어려우니 양해 부탁드립니다.",
  },
  {
    question: "반찬은 어떻게 주문하나요?",
    answer:
      "원하는 반찬을 선택한 후 '구매하기' 버튼을 눌러 픽업 날짜와 시간을 선택하고 결제하시면 됩니다. 장바구니에 여러 반찬을 담아 한 번에 주문하실 수도 있습니다.",
  },
  {
    question: "픽업은 어떻게 하나요?",
    answer:
      "주문 시 선택하신 날짜와 시간에 픽업 장소로 방문하시면 됩니다. 주문 확인 메시지를 보여주시면 반찬을 수령하실 수 있습니다.",
  },
  {
    question: "환불은?",
    answer:
      "픽업 2시간 전까지 주문 내역에서 취소 가능하며, 결제하신 금액이 전액 환불됩니다. 그 이후에는 환불이 어려우니 양해 부탁드립니다.",
  },
];

export default function SupportPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(() => {
    ChannelService.boot({
      pluginKey: "67502dfa-39a4-4d1e-8332-59d195da33a7",
      hideChannelButtonOnBoot: true,
    });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return (
    <>
      <div className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        <div className="space-y-1 border-b-[0.5px] border-gray-300 pb-2">
          <div>
            <p className="text-paragraph font-semibold">전화 문의</p>
            <p className="text-paragraph text-gray-600">평일 9:00 - 18:00</p>
          </div>
          <p className="text-paragraph font-semibold text-eatda-orange">
            1234 - 5678
          </p>
        </div>

        <div className="space-y-1 border-b-[0.5px] border-gray-300 pb-2">
          <div>
            <p className="text-paragraph font-semibold">채널톡 문의</p>
            <p className="text-paragraph text-gray-600">24시간 접수</p>
          </div>
          <p className="text-paragraph font-semibold text-eatda-orange">
            하단의 메시지 버튼을 클릭해주세요
          </p>
        </div>

        <div className="space-y-1 border-b-[0.5px] border-gray-300 pb-2">
          <div>
            <p className="text-paragraph font-semibold">카카오톡 문의</p>
            <p className="text-paragraph text-gray-600">평일 9:00 - 18:00</p>
          </div>
          <p className="text-paragraph font-semibold text-eatda-orange">
            카카오톡에서 &lsquo;잇다 EAT-DA&rsquo;를 검색해주세요
          </p>
        </div>

        <div className="pt-5 space-y-3">
          <h2 className="text-display-4 font-semibold">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b-[0.5px] border-gray-400 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-4 text-left hover:bg-gray-50"
                >
                  <p className="text-paragraph">{faq.question}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform ${
                      openIndex === index ? "rotate-180" : ""
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
                {openIndex === index && (
                  <div className="pb-4 pt-0">
                    <p className="text-paragraph text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => ChannelService.showMessenger()}
        className="fixed bg-white bottom-20 right-5 z-50 w-12 h-12 rounded-2xl shadow flex items-center justify-center"
      >
        <Image src="/Message.svg" alt="채널톡 문의" width={28} height={28} />
      </button>
      <BottomNavigation />
    </>
  );
}
