import './globals.css';
import './src/styles/tailwind.css';
import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import PickupAlarmProvider from '@/app/src/components/common/PickupAlarmProvider';
import GlobalToastProvider from '@/app/src/components/common/GlobalToastProvider';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: '잇다 - 우리 동네 주부님의 집밥',
  description: '정성 가득 집밥 한 끼',
  openGraph: {
    title: '잇다 - 우리 동네 주부님의 집밥',
    description: '정성 가득 집밥 한 끼',
    images: [
      {
        url: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1770784776/febc15-final04-ecad/oEd-zW4BO.jpg',
        width: 1200,
        height: 630,
        alt: '잇다 대표 이미지',
      },
    ],
    type: 'website',
    siteName: '잇다',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body suppressHydrationWarning>
        <PickupAlarmProvider />
        <GlobalToastProvider />
        <div className="w-full max-w-[744px] min-w-[390px] mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
