import './globals.css';
import './src/styles/tailwind.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body suppressHydrationWarning>
        <div className="w-full max-w-[744px] min-w-[390px] mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
