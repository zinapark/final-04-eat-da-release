import Image from 'next/image';

export interface ReviewItemProps {
  showDivider?: boolean;
  userName?: string;
  profileImage?: string;
  rating?: number;
  createdAt?: string;
  productName?: string;
  content?: string;
  images?: string[];
}

export default function ReviewItem({
  showDivider = true,
  userName = '익명',
  profileImage = '/seller/seller1.png',
  rating = 5,
  createdAt = '',
  productName = '',
  content = '',
  images = [],
}: ReviewItemProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const normalized = dateString.includes('.')
      ? dateString.replace(/\./g, '-').replace(' ', 'T')
      : dateString;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };

  return (
    <article className="flex flex-col w-full gap-2.5 pt-5">
      {/* 리뷰 콘텐츠 */}
      <div className="w-full flex flex-1 px-5 items-center gap-2">
        {/* 프로필 아이콘 */}
        <img
          src={profileImage}
          alt={`${userName} 프로필 이미지`}
          className="h-7.5 w-7.5 flex-none rounded-full object-cover bg-gray-300"
        />

        {/* 상단: 이름 + 날짜 */}
        <div className="w-full flex flex-col items-start">
          <div className="w-full flex items-center justify-between">
            <span className="text-paragraph-sm text-gray-800 font-regular">
              {userName}
            </span>
            {/* 별점 */}
            <div className="flex shrink-0 gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="text-sm">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6 4.8282C12.5938 4.97659 12.5153 5.14606 12.3631 5.27989C11.7537 5.81524 11.144 6.35008 10.5339 6.88442C10.249 7.13435 9.96381 7.3839 9.67818 7.63306C9.63736 7.66853 9.62699 7.69998 9.63953 7.75502C9.8588 8.71317 10.0763 9.67171 10.292 10.6306C10.3356 10.8234 10.3786 11.0164 10.4258 11.2085C10.4946 11.4929 10.4067 11.7739 10.1851 11.933C9.94117 12.108 9.68219 12.1194 9.42439 11.9665C8.6032 11.4783 7.78307 10.9882 6.96399 10.4961C6.77277 10.3819 6.57921 10.2703 6.39117 10.1518C6.32827 10.1122 6.2826 10.1119 6.21803 10.1507C5.22195 10.7486 4.22371 11.3428 3.22881 11.9406C3.01751 12.0674 2.8017 12.115 2.56816 12.0192C2.25917 11.8924 2.09773 11.5675 2.17452 11.2299C2.39166 10.2743 2.60915 9.31872 2.82696 8.36313C2.8728 8.16238 2.91379 7.96012 2.96348 7.76087C2.97786 7.70332 2.96783 7.66936 2.92416 7.63139C2.54987 7.30583 2.17652 6.97916 1.80412 6.65137C1.28233 6.19332 0.758534 5.73845 0.239753 5.27705C0.0279584 5.08901 -0.052343 4.84894 0.0344829 4.57441C0.121309 4.29988 0.31537 4.1346 0.60479 4.10482C1.11772 4.05229 1.63148 4.00829 2.1449 3.96128C2.65281 3.91477 3.16072 3.8686 3.66862 3.82276C3.83792 3.80753 4.00723 3.79047 4.1767 3.77759C4.23123 3.77357 4.26034 3.74965 4.28075 3.69996C4.74081 2.61891 5.20165 1.53829 5.66328 0.45813C5.79075 0.159509 6.01844 -0.00728399 6.30786 0.000244267C6.59728 0.00777252 6.80607 0.149136 6.92083 0.414968C7.23317 1.13818 7.54149 1.86307 7.85115 2.58762C8.00875 2.95567 8.16667 3.32472 8.32159 3.69444C8.34534 3.75132 8.3793 3.77341 8.43869 3.77809C8.84689 3.81266 9.25498 3.84891 9.66295 3.88683C10.257 3.94081 10.8509 3.99524 11.4448 4.05011C11.6335 4.06684 11.8224 4.08357 12.0106 4.10465C12.3529 4.14513 12.6027 4.43071 12.6 4.8282Z"
                      fill={index < rating ? '#FF6155' : '#D1D5DB'}
                    />
                  </svg>
                </span>
              ))}
            </div>
          </div>
          <span className="text-x-small text-gray-600 font-regular">
            {formatDate(createdAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {/* 메뉴명 */}
        {productName && (
          <p className="text-paragraph-sm px-5 text-gray-600 font-regular">
            {productName}
          </p>
        )}

        {/* 리뷰 내용 */}
        {content && (
          <p className="w-full text-paragraph px-5 text-gray-800 font-regular">
            {content}
          </p>
        )}

        {/* 리뷰 이미지 */}
        {images.filter(Boolean).length > 0 && (
          <section className="mt-4 flex px-5 gap-1 overflow-x-auto scrollbar-hide">
            {images.filter(Boolean).map((imageSrc, index) => (
              <div
                key={index}
                className="relative aspect-square w-28 shrink-0 overflow-hidden"
              >
                <Image
                  src={imageSrc}
                  alt={`${productName || '리뷰'} 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </section>
        )}
        {showDivider && <div className="mt-5 mx-5 border-b border-gray-400" />}
      </div>
    </article>
  );
}
