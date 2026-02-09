'use client';

import GrayButton from '@/app/src/components/ui/GrayButton';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { geocodeAddress, getUserAddress } from '@/lib/map';
import { sharedKitchen, SharedKitchen } from './sharedKitchens';
import CustomMarker from './CustomMarker';

interface KitchenWithCoords {
  kitchen: SharedKitchen;
  lat: number;
  lng: number;
}

const DEFAULT_CENTER = { lat: 37.5565, lng: 126.918 };

export default function MapClient() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [kitchenMarkers, setKitchenMarkers] = useState<KitchenWithCoords[]>([]);
  const [selected, setSelected] = useState<SharedKitchen | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  // SDK가 이미 로드된 경우 감지 (페이지 재방문 시)
  useEffect(() => {
    if (window.kakao?.maps) {
      kakao.maps.load(() => setIsLoaded(true));
    }
  }, []);

  // 사용자 주소 가져오기
  useEffect(() => {
    getUserAddress().then((address) => {
      if (address) setUserAddress(address);
    });
  }, []);

  // SDK 로드 + 주소 준비 후 좌표변환
  useEffect(() => {
    if (!isLoaded || !userAddress) return;

    // 좌표 변환기
    const geocoder = new kakao.maps.services.Geocoder();

    // 사용자 주소 좌표변환
    geocodeAddress(geocoder, userAddress).then((coords) => {
      if (coords) {
        setCenter(coords);
        setUserCoords(coords);
      }
    });

    // 공유주방 주소 좌표변환
    Promise.all(
      sharedKitchen.map(async (kitchen) => {
        const coords = await geocodeAddress(geocoder, kitchen.address);
        return coords ? { kitchen, ...coords } : null;
      })
    ).then((results) => {
      // 좌표 변환 실패 시 필터 처리
      setKitchenMarkers(results.filter(Boolean) as KitchenWithCoords[]);
    });
  }, [isLoaded, userAddress]);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => {
          kakao.maps.load(() => setIsLoaded(true));
        }}
      />

      {isLoaded ? (
        <Map
          center={center}
          style={{ width: '100%', height: '600px' }}
          level={5}
        >
          {/* 사용자 위치 마커 (빨간 점) */}
          {userCoords && (
            <CustomOverlayMap position={userCoords} yAnchor={0.5}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: '#ff6155',
                  border: '3px solid white',
                  borderRadius: '50%',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              />
            </CustomOverlayMap>
          )}

          {/* 공유주방 마커/커스텀 마커 사용 */}
          {kitchenMarkers.map((item, idx) => (
            <CustomOverlayMap
              key={idx}
              position={{ lat: item.lat, lng: item.lng }}
              yAnchor={1.2}
            >
              <CustomMarker onClick={() => setSelected(item.kitchen)} />
            </CustomOverlayMap>
          ))}
        </Map>
      ) : (
        <div
          style={{
            width: '100%',
            height: '600px',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          지도 로딩중...
        </div>
      )}

      {/* 선택된 공유주방 정보 */}
      {selected && (
        <div className="p-4 mt-5 mx-5 rounded-lg border border-gray-400">
          <p className="text-display-3 font-semibold">선택된 공유주방</p>
          <p className="text-display-2 mt-1 text-gray-600">{selected.name}</p>
          <p className="text-display-1 text-gray-500 mb-2">
            {selected.address}
          </p>
          <GrayButton
            text="선택 완료"
            onClick={() => {
              sessionStorage.setItem(
                'selectedKitchen',
                JSON.stringify(selected)
              );
              router.back();
            }}
          />
        </div>
      )}
    </>
  );
}
