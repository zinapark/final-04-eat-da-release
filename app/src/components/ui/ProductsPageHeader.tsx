'use client';

import Header from '@/app/src/components/common/Header';
import useNearestKitchen from '@/hooks/useNearestKitchen';
import Script from 'next/script';

export default function ProductsPageHeader() {
  const { kitchenName, onKakaoLoad } = useNearestKitchen();

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={onKakaoLoad}
      />
      <Header title={kitchenName} showBackButton showSearch showCart />
    </>
  );
}
