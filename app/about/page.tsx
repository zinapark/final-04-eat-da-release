'use client';

import Header from '@/app/src/components/common/Header';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// ─── Scroll-triggered animation hook (fires once) ───
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// ─── Scroll-based active tracking (toggles on/off) ───
function useScrollActive<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '-40% 0px -40% 0px'
) {
  const ref = useRef<T>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isActive };
}

// ─── Animated counter ───
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView(0.5);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Values data ───
const VALUES = [
  {
    title: '주부에게',
    desc: '익숙한 집밥을 통해 새로운 수익의 기회를 제공합니다. 판매와 리뷰를 바탕으로 성장하는 티어 시스템으로 노력과 손맛이 인정받는 경험을 만듭니다.',
    gradient: 'from-orange-100 to-amber-50',
  },
  {
    title: '자취생에게',
    desc: '번거로운 조리 없이도 든든한 집밥을 안정적으로 먹을 수 있게 돕습니다. 배달이 아닌 픽업 방식으로 신선함을 지키고, 부담을 줄입니다.',
    gradient: 'from-red-50 to-orange-50',
  },
  {
    title: '동네에게',
    desc: '같은 동네 안에서 이루어지는 집밥 거래를 통해 이웃 간의 연결과 신뢰를 쌓아가며, 동네가 함께 살아나는 지속 가능한 식탁 경험을 제공합니다.',
    gradient: 'from-amber-50 to-yellow-50',
  },
];

// ─── Features data ───
const FEATURES = [
  {
    title: '동네 기반',
    desc: '같은 동네 공유주방에서 만들고\n직접 픽업하는 가까운 집밥',
    img: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770619870/febc15-final04-ecad/LAsYCAADh.jpg',
  },
  {
    title: '티어 시스템',
    desc: '1단부터 9단까지\n신뢰를 시각화하는 투명한 평가',
    img: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770620041/febc15-final04-ecad/kFttNNREY.jpg',
  },
  {
    title: '손맛 중심',
    desc: '전문 셰프가 아닌\n주부의 일상 손맛이 만드는 진짜 집밥',
    img: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770620078/febc15-final04-ecad/bA1nSYmCw.jpg',
  },
];

// ─── Steps data ───
const STEPS = [
  {
    num: '01',
    title: '앱에서 선택',
    desc: '동네 주부님들이 만든 다양한 반찬 메뉴 중 원하는 반찬을 골라요',
    img: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770621235/febc15-final04-ecad/jspcQ1Hmu.jpg',
  },
  {
    num: '02',
    title: '공유주방에서 조리',
    desc: '주부님이 동네 공유주방에서 신선한 재료로 정성껏 만들어요',
    img: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770620452/febc15-final04-ecad/QUXx5vuaM.avif',
  },
  {
    num: '03',
    title: '직접 픽업',
    desc: '같은 동네 공유주방에서 갓 만든 반찬을 직접 받아가요',
    img: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770621721/febc15-final04-ecad/MZK0AipHe.avif',
  },
];

// ─── Usage data ───
const USAGE_SECTIONS = [
  {
    id: 'seller',
    title: '주부님 가입 절차',
    steps: [
      '앱 다운로드 및 주부 회원가입',
      '간단한 요리 경력 및 위생 교육 이수',
      '동네 공유주방 배정 및 이용 안내',
      '메뉴 등록 및 판매 시작',
      '리뷰와 판매량으로 티어 상승',
    ],
  },
  {
    id: 'buyer',
    title: '자취생 이용 방법',
    steps: [
      '앱 다운로드 및 회원가입',
      '내 동네 설정 및 공유주방 확인',
      '원하는 반찬 선택 및 주문/구독',
      '지정된 시간에 공유주방 방문',
      '갓 만든 반찬 픽업 후 맛있게 식사',
    ],
  },
];

// ─── Scroll-reveal value card ───
function ValueCard({
  item,
  index,
  sectionInView,
}: {
  item: (typeof VALUES)[number];
  index: number;
  sectionInView: boolean;
}) {
  const { ref, isActive } = useScrollActive<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`rounded-lg overflow-hidden transition-all duration-500 ${
        sectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      } ${isActive ? 'bg-eatda-orange scale-[1.02]' : 'bg-gray-200'}`}
      style={{
        transitionDelay: sectionInView ? `${(index + 2) * 150}ms` : '0ms',
      }}
    >
      <div className="p-5">
        <h3
          className={`text-display-3 font-semibold transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-eatda-orange'
          }`}
        >
          {item.title}
        </h3>

        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isActive
              ? 'grid-rows-[1fr] opacity-100 mt-2'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p
              className={`text-paragraph font-regular transition-colors duration-300 ${
                isActive ? 'text-white/90' : 'text-gray-600'
              }`}
            >
              {item.desc}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Main Page ───
export default function AboutPage() {
  const hero = useInView(0.1);
  const stats = useInView(0.2);
  const values = useInView(0.15);
  const features = useInView(0.15);
  const steps = useInView(0.1);
  const usage = useInView(0.15);
  const cta = useInView(0.2);

  const imageRef = useRef<HTMLDivElement>(null);
  const [imageOverlayVisible, setImageOverlayVisible] = useState(false);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageOverlayVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -65% 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const [expandedUsage, setExpandedUsage] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance steps
  useEffect(() => {
    if (!steps.isInView) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, [steps.isInView]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeStep < 2) setActiveStep(activeStep + 1);
      if (diff < 0 && activeStep > 0) setActiveStep(activeStep - 1);
    }
  };

  return (
    <>
      <Header title=" " showBackButton />

      <main className="flex flex-col mt-12 overflow-hidden">
        {/* ── 1. Hero ── */}
        <div
          ref={hero.ref}
          className={`relative text-center pt-14 pb-5 px-5 bg-white transition-all duration-1000 ${
            hero.isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="relative flex items-center justify-center mx-10 text-3xl font-bold text-eatda-orange leading-tight">
            <span className="shrink-0">잇</span>
            <span
              className="flex-1 h-1 bg-eatda-orange mx-3 overflow-hidden"
              style={
                hero.isInView
                  ? { animation: 'line-expand 0.8s ease-in 1.1s both' }
                  : undefined
              }
            />
            <span className="shrink-0">다</span>
          </h2>
          <p
            className={`relative text-paragraph text-eatda-orange/70 mt-4 leading-relaxed transition-all duration-700 delay-500 ${
              hero.isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            주부의 부엌에서 시작된 집밥이
            <br />
            동네를 거쳐 혼자의 식탁으로 이어지는 연결의 서비스
          </p>
        </div>

        {/* ── 2. Stats ── */}
        <div
          ref={stats.ref}
          className={`px-5 py-8 transition-all duration-700 ${
            stats.isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 150, suffix: '+', label: '등록 주부님' },
              { value: 3000, suffix: '+', label: '만족한 자취생' },
              { value: 98, suffix: '%', label: '재주문율' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 bg-gray-200 rounded-lg transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-xl font-bold text-eatda-orange">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Values - Scroll-reveal cards ── */}
        <section ref={values.ref} className="px-5 pb-8">
          <h2
            className={`text-display-5 font-semibold text-gray-800 pb-4 transition-all duration-700 ${
              values.isInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          >
            잇다가 만드는 가치
          </h2>

          <div
            ref={imageRef}
            className={`relative w-full aspect-4/3 rounded-lg overflow-hidden mb-5 transition-all duration-700 delay-200 ${
              values.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src="https://res.cloudinary.com/ddedslqvv/image/upload/v1770617645/febc15-final04-ecad/PlvB29c4E.jpg"
              alt="여러 가지 반찬이 차려진 집밥 상"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                imageOverlayVisible ? 'bg-black/60' : 'bg-black/0'
              }`}
            />
            <div
              className={`relative z-10 flex items-center justify-center h-full px-6 transition-all duration-700 ${
                imageOverlayVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-[18px] font-regular text-white text-center leading-relaxed">
                잇다(eat-da)는
                <br />
                주부와 자취생을 집밥으로 잇는
                <br />
                <span className="font-bold">동네 기반 반찬 구독 서비스</span>
                입니다.
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            {VALUES.map((item, i) => (
              <ValueCard
                key={i}
                item={item}
                index={i}
                sectionInView={values.isInView}
              />
            ))}
          </ul>
        </section>
        <hr className="mx-5 border-t-[0.5px] border-gray-300" />

        {/* ── 4. Features ── */}
        <section ref={features.ref} className="px-5 py-8">
          <h2
            className={`text-display-5 font-semibold text-gray-800 pb-4 transition-all duration-700 ${
              features.isInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          >
            잇다의 핵심 특징
          </h2>

          <div className="flex flex-col gap-3">
            {FEATURES.map((feature, i) => (
              <article
                key={i}
                className={`relative rounded-lg overflow-hidden aspect-[2/1] transition-all duration-500 hover:-translate-y-1 active:scale-95 ${
                  features.isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                  <h3 className="text-display-5 font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-paragraph text-white/85 whitespace-pre-line">
                    {feature.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <hr className="mx-5 border-t-[0.5px] border-gray-300" />

        {/* ── 5. Interactive Steps ── */}
        <section ref={steps.ref} className="px-5 py-8">
          <h2
            className={`text-display-5 font-semibold text-gray-800 transition-all duration-700 ${
              steps.isInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          >
            잇다는 이렇게 작동해요
          </h2>
          <p
            className={`text-paragraph text-gray-600 pb-6 transition-all duration-700 delay-200 ${
              steps.isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            간단한 3단계로 동네 집밥을 만나보세요
          </p>

          {/* Step indicator buttons */}
          <div className="w-full flex items-center justify-between mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex items-center ${i < 2 ? 'flex-1' : ''}`}
              >
                <button
                  onClick={() => setActiveStep(i)}
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    activeStep === i
                      ? 'bg-eatda-orange text-white scale-110'
                      : activeStep > i
                        ? 'bg-eatda-orange/20 text-eatda-orange'
                        : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 transition-all duration-500 ${
                      activeStep > i ? 'bg-eatda-orange' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content with slide animation */}
          <div
            className="relative min-h-85"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  activeStep === i
                    ? 'opacity-100 translate-x-0 relative'
                    : i > activeStep
                      ? 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
                      : 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-4">
                  <strong className="text-display-3 font-semibold text-eatda-orange">
                    {step.num}. {step.title}
                  </strong>
                  <p className="text-paragraph text-gray-600 mt-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                aria-label={`${i + 1}단계로 이동`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeStep === i
                    ? 'w-6 bg-eatda-orange'
                    : 'w-2 bg-gray-400 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </section>
        <hr className="mx-5 border-t-[0.5px] border-gray-300" />

        {/* ── 6. Usage - Accordion ── */}
        <section ref={usage.ref} className="px-5 py-8">
          <h2
            className={`text-display-5 font-semibold text-gray-800 transition-all duration-700 ${
              usage.isInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          >
            이용 방법
          </h2>
          <p
            className={`text-paragraph text-gray-600 pb-4 transition-all duration-700 delay-200 ${
              usage.isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            주부와 자취생 모두 간편하게 시작할 수 있어요
          </p>

          <div className="flex flex-col gap-3">
            {USAGE_SECTIONS.map((section, sIdx) => {
              const isExpanded = expandedUsage === section.id;
              return (
                <div
                  key={section.id}
                  className={`rounded-lg overflow-hidden border-[0.5px] transition-all duration-500 ${
                    isExpanded
                      ? 'border border-eatda-orange bg-white'
                      : 'border-gray-200 bg-gray-200'
                  } ${
                    usage.isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${sIdx * 200}ms` }}
                >
                  <button
                    onClick={() =>
                      setExpandedUsage(isExpanded ? null : section.id)
                    }
                    className="w-full p-5 flex items-center justify-between"
                  >
                    <h3 className="text-display-3 font-semibold text-gray-800">
                      {section.title}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ol className="px-5 pb-5 flex flex-col gap-3">
                        {section.steps.map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3"
                            style={{
                              animation: isExpanded
                                ? `slide-in-left 0.4s ease-out ${i * 0.08}s both`
                                : 'none',
                            }}
                          >
                            <span className="shrink-0 text-eatda-orange text-paragraph font-bold">
                              {i + 1}
                            </span>
                            <span className="text-paragraph text-gray-600">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. CTA ── */}
        <section
          ref={cta.ref}
          className={`text-center pb-18 py-12 px-5 bg-gray-200 from-orange-50 via-white to-amber-50 transition-all duration-1000 ${
            cta.isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-display-5 font-semibold text-gray-800">
            지금 바로 시작해보세요
          </h2>
          <p className="text-paragraph text-gray-600 mt-2 mb-8">
            주부님의 손맛이 필요한 자취생이,
            <br />
            자취생의 응원이 필요한 주부님이 기다리고 있어요
          </p>

          <nav aria-label="시작하기">
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/signup?role=seller"
                  className="group relative block w-full py-4 bg-eatda-orange text-white text-display-3 font-semibold rounded-lg text-center overflow-hidden transition-all duration-300 active:scale-95"
                >
                  <span className="relative z-10">주부 가입하기</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="block w-full py-4 bg-white border-1 border-eatda-orange text-eatda-orange text-display-3 font-semibold rounded-lg text-center transition-all duration-300 hover:bg-eatda-orange hover:text-white active:scale-95"
                >
                  반찬 주문하기
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </main>
    </>
  );
}
