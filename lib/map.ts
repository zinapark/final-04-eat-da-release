import { getTokenPayload } from '@/lib/axios';
import { getUser } from '@/lib/mypage';

// 로그인한 사용자의 주소 조회
export async function getUserAddress(): Promise<string | null> {
  const tokenPayload = getTokenPayload();
  if (!tokenPayload) return null;

  const user = await getUser(tokenPayload._id);
  return user?.address ?? null;
}

// 주소 → 좌표 변환
export function geocodeAddress(
  geocoder: kakao.maps.services.Geocoder,
  address: string
): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
        });
      } else {
        resolve(null);
      }
    });
  });
}
