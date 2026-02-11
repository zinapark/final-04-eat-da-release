'use client';

import BottomNavigation from '@/app/src/components/common/BottomNavigation';
import { useState, useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import Image from 'next/image';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: '반찬은 어떻게 주문하나요?',
    answer:
      "원하는 반찬을 선택한 후 '구매하기' 버튼을 눌러 픽업 날짜와 시간을 선택하고 결제하시면 됩니다. 장바구니에 여러 반찬을 담아 한 번에 주문하실 수도 있습니다.",
  },
  {
    question: '픽업은 어떻게 하나요?',
    answer:
      '주문 시 선택하신 날짜와 시간에 해당 공유주방으로 방문하시면 됩니다. 마이페이지의 구매 내역에서 픽업 장소와 시간을 다시 확인하실 수 있습니다.',
  },
  {
    question: '주문 취소 및 환불은 어떻게 하나요?',
    answer:
      '픽업 예정 시간 2시간 전까지 마이페이지 > 구매 내역에서 취소 가능하며, 결제하신 금액은 전액 환불됩니다. 픽업 시간 2시간 이내에는 취소가 어려우니 양해 부탁드립니다.',
  },
  {
    question: '구독은 어떤 서비스인가요?',
    answer:
      '원하는 주부님을 구독하면 매주 정해진 횟수만큼 반찬을 받아보실 수 있습니다. 주 2회, 주 4회, 매일 총 3가지 플랜이 있으며, 마이페이지에서 언제든 변경하거나 해지할 수 있습니다.',
  },
  {
    question: '알레르기가 있는데 재료를 확인할 수 있나요?',
    answer:
      '각 반찬 상세페이지에서 사용된 재료 목록을 확인하실 수 있습니다. 추가로 궁금한 사항이 있으시면 채널톡이나 전화 문의를 통해 판매자에게 직접 확인하실 수 있습니다.',
  },
  {
    question: '결제 수단은 어떤 것이 있나요?',
    answer:
      '카카오페이, 신용카드, 체크카드 등 다양한 결제 수단을 지원하고 있습니다. 결제 단계에서 원하시는 수단을 선택해 주세요.',
  },
  {
    question: '같은 공유주방 반찬만 함께 주문할 수 있나요?',
    answer:
      '네, 장바구니에는 같은 공유주방의 반찬만 함께 담을 수 있습니다. 다른 공유주방의 반찬을 주문하시려면 기존 장바구니를 비우거나 별도로 주문해 주세요.',
  },
  {
    question: '반찬의 유통기한은 어떻게 되나요?',
    answer:
      '잇다의 반찬은 당일 조리된 신선한 반찬입니다. 냉장 보관 시 수령일 포함 2~3일 이내에 드시는 것을 권장드리며, 반찬 종류에 따라 다를 수 있습니다.',
  },
  {
    question: '주부(판매자)로 등록하고 싶어요.',
    answer:
      '현재 판매자 등록은 별도 심사를 통해 진행되고 있습니다. 채널톡 또는 카카오톡으로 문의해 주시면 등록 절차를 안내해 드리겠습니다.',
  },
];

export default function SupportPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: '67502dfa-39a4-4d1e-8332-59d195da33a7',
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
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b-[0.5px] border-gray-400">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center pt-2.5 pb-5 text-left"
                  >
                    <p className="text-paragraph">{faq.question}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`shrink-0 transition-transform duration-300 ease-in-out ${
                        isOpen ? 'rotate-180' : ''
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
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                    }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="pb-4 transition-opacity duration-300 ease-in-out"
                        style={{ opacity: isOpen ? 1 : 0 }}
                      >
                        <p className="text-paragraph text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="fixed bottom-20 z-50 w-full max-w-186 left-1/2 -translate-x-1/2 pointer-events-none">
        <button
          type="button"
          onClick={() => ChannelService.showMessenger()}
          className="absolute right-5 min-[744px]:right-3 bottom-0 pointer-events-auto bg-white w-12 h-12 rounded-2xl shadow flex items-center justify-center"
        >
          <Image src="/Message.svg" alt="채널톡 문의" width={28} height={28} />
        </button>
      </div>
      <BottomNavigation />
    </>
  );
}
