'use client';

import { useEffect, useState, useCallback } from 'react';
import { sharedKitchen, SharedKitchen } from '@/app/mypage/map/sharedKitchens';
import { getUserAddress, geocodeAddress } from '@/lib/map';
import useKitchenStore from '@/zustand/kitchenStore';
import useUserStore from '@/zustand/userStore';

const DEFAULT_KITCHEN_NAME = ' ';
const KITCHEN_COORDS_CACHE_KEY = 'kitchen-coords-cache';

interface KitchenWithCoords {
  kitchen: SharedKitchen;
  lat: number;
  lng: number;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function useNearestKitchen() {
  const user = useUserStore((state) => state.user);
  const { nearestKitchen, setNearestKitchen } = useKitchenStore();
  const [kitchenName, setKitchenName] = useState(
    nearestKitchen || DEFAULT_KITCHEN_NAME
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const onKakaoLoad = useCallback(() => {
    kakao.maps.load(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (window.kakao?.maps) {
      kakao.maps.load(() => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const findNearestKitchen = async () => {
      const userAddress = await getUserAddress();
      if (!userAddress) return;

      const geocoder = new kakao.maps.services.Geocoder();

      const userCoords = await geocodeAddress(geocoder, userAddress);
      if (!userCoords) return;

      let kitchenCoords: KitchenWithCoords[] = [];

      const cached = sessionStorage.getItem(KITCHEN_COORDS_CACHE_KEY);
      if (cached) {
        try {
          kitchenCoords = JSON.parse(cached);
        } catch {
          sessionStorage.removeItem(KITCHEN_COORDS_CACHE_KEY);
        }
      }

      if (kitchenCoords.length === 0) {
        const results = await Promise.all(
          sharedKitchen.map(async (kitchen) => {
            const coords = await geocodeAddress(geocoder, kitchen.address);
            return coords ? { kitchen, ...coords } : null;
          })
        );
        kitchenCoords = results.filter(Boolean) as KitchenWithCoords[];
        sessionStorage.setItem(
          KITCHEN_COORDS_CACHE_KEY,
          JSON.stringify(kitchenCoords)
        );
      }

      let nearest: KitchenWithCoords | null = null;
      let minDist = Infinity;
      for (const kc of kitchenCoords) {
        const dist = haversineDistance(
          userCoords.lat,
          userCoords.lng,
          kc.lat,
          kc.lng
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = kc;
        }
      }

      if (nearest) {
        setKitchenName(nearest.kitchen.name);
        setNearestKitchen(nearest.kitchen.name);
      }
    };

    findNearestKitchen();
  }, [isLoaded, user, setNearestKitchen]);

  return { kitchenName, nearestKitchen, isLoaded, onKakaoLoad };
}
