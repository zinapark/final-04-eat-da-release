'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IconProps {
  isActive: boolean;
}

function HomeIcon({ isActive }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={isActive ? 'text-eatda-orange' : 'text-gray-600'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.16 6.94918L10.4569 1.6367C10.3208 1.54844 10.1621 1.50146 9.99998 1.50146C9.83782 1.50146 9.67914 1.54844 9.5431 1.6367L1.84 6.94918C1.73419 7.02322 1.64796 7.12186 1.58873 7.23662C1.5295 7.35137 1.49905 7.4788 1.5 7.60793V15.5767C1.5 16.3516 1.80784 17.0948 2.35579 17.6427C2.90375 18.1907 3.64694 18.4985 4.42187 18.4985H6.81249V13.9829C6.81249 13.208 7.12032 12.4648 7.66828 11.9168C8.21624 11.3689 8.95943 11.061 9.73435 11.061H10.2656C11.0405 11.061 11.7837 11.3689 12.3317 11.9168C12.8796 12.4648 13.1875 13.208 13.1875 13.9829V18.4985H15.5781C16.353 18.4985 17.0962 18.1907 17.6442 17.6427C18.1921 17.0948 18.5 16.3516 18.5 15.5767V7.60793C18.5009 7.4788 18.4705 7.35137 18.4112 7.23662C18.352 7.12186 18.2658 7.02322 18.16 6.94918Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DishIcon({ isActive }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={isActive ? 'text-eatda-orange' : 'text-gray-600'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
        fill="currentColor"
      />
      <path
        d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z"
        fill="currentColor"
        stroke="white"
        strokeWidth="1.25"
      />
    </svg>
  );
}
function ApronIcon({ isActive }: IconProps) {
  return (
    <svg
      width="20"
      height="22.5"
      viewBox="0 0 16 18"
      className={isActive ? 'text-eatda-orange' : 'text-gray-600'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.26 17H2.74L2.3 16.8014L2.04 16.4241L2 8.91706L2.16 8.51986L3.06 7.90421L3.8 7.12967L4.28 6.41472L4.8 5.38201L5.24 4.1507L5.44 3.39603V1.61565L5.56 1.37734L5.9 1.07944L6.14 1L6.58 1.03972L6.82 1.15888L7.12 1.53621L7.18 3.41589L8.84 3.39603V1.65537L9 1.33762L9.18 1.15888L9.58 1H9.86L10.18 1.11916L10.44 1.37734L10.56 1.61565V3.39603L11.12 5.18341L11.52 6.05724L12.2 7.12967L12.94 7.90421L13.74 8.42056L13.84 8.51986L14 8.91706V16.2652L13.76 16.7418L13.58 16.8808L13.26 17ZM10.76 12.6904L11.02 12.5911L11.24 12.3727L11.4 12.0152V11.7769L11.28 11.4591L11.02 11.2009L10.54 11.0421H5.46L4.98 11.2009L4.72 11.4591L4.6 11.7769V12.0152L4.76 12.3727L4.98 12.5911L5.26 12.7103L10.76 12.6904Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HeartIcon({ isActive }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={isActive ? 'text-eatda-orange' : 'text-gray-600'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_363_2482)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99313 3.4903C8.0137 1.27366 4.7128 0.677387 2.23264 2.70717C-0.247508 4.73696 -0.596677 8.13062 1.35099 10.5313L9.99313 18.5348L18.6353 10.5313C20.5831 8.13062 20.2765 4.71561 17.7537 2.70717C15.2309 0.698745 11.9727 1.27366 9.99313 3.4903Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_363_2482">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function UserIcon({ isActive }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={isActive ? 'text-eatda-orange' : 'text-gray-600'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
        fill="currentColor"
      />
      <path
        d="M9.99983 10.684C11.6201 10.684 12.9337 9.37053 12.9337 7.75023C12.9337 6.12992 11.6201 4.81641 9.99983 4.81641C8.37953 4.81641 7.06601 6.12992 7.06601 7.75023C7.06601 9.37053 8.37953 10.684 9.99983 10.684Z"
        fill="white"
      />
      <path
        d="M15.4237 15.0547C15.178 14.7571 14.9094 14.4793 14.6204 14.2237C13.3903 13.0044 11.7355 12.3094 10.0037 12.2847C8.27192 12.3094 6.61714 13.0044 5.38703 14.2237C5.10999 14.4866 4.85377 14.7706 4.62066 15.0731C4.56804 15.1462 4.52751 15.2273 4.50063 15.3132C4.8288 15.6814 5.19046 16.0183 5.58093 16.3196C6.86448 17.2918 8.43051 17.8179 10.0406 17.8179C11.6508 17.8179 13.2168 17.2918 14.5003 16.3196C14.878 16.0166 15.2272 15.6797 15.5437 15.3132C15.5187 15.2208 15.4781 15.1334 15.4237 15.0547Z"
        fill="white"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    label: '홈',
    href: '/home',
    icon: HomeIcon,
  },
  {
    label: '반찬',
    href: '/products',
    icon: DishIcon,
  },
  {
    label: '주부',
    href: '/sellers',
    icon: ApronIcon,
  },
  {
    label: '찜',
    href: '/wishlist',
    icon: HeartIcon,
  },
  {
    label: '마이페이지',
    href: '/mypage',
    icon: UserIcon,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        
        bg-gray-200/90
        backdrop-blur
      "
      aria-label="하단 네비게이션"
    >
      <div className="w-full max-w-[744px] min-w-[390px] mx-auto h-16">
        <ul className="flex h-full items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex flex-col items-center gap-1"
                >
                  <Icon isActive={isActive} />

                  <span
                    className={`text-x-small ${
                      isActive
                        ? 'text-eatda-orange font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
