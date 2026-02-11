'use client';

import { useEffect } from 'react';
import { fetchPurchases } from '@/lib/purchase';
import { schedulePickupAlarms } from '@/lib/pickupAlarm';
import useUserStore from '@/zustand/userStore';
import useNotificationStore from '@/zustand/notificationStore';

export default function PickupAlarmProvider() {
  const user = useUserStore((state) => state.user);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const hasPickupNotification = useNotificationStore(
    (state) => state.hasPickupNotification,
  );
  const hasPostPickupNotification = useNotificationStore(
    (state) => state.hasPostPickupNotification,
  );
  const refreshTrigger = useNotificationStore(
    (state) => state.refreshTrigger,
  );

  useEffect(() => {
    if (!user) return;

    let timers: ReturnType<typeof setTimeout>[] = [];

    async function init() {
      // persist hydration이 완료될 때까지 대기
      if (!useNotificationStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useNotificationStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }

      try {
        const purchases = await fetchPurchases();
        timers = schedulePickupAlarms(purchases, user!._id, {
          addNotification,
          hasPickupNotification,
          hasPostPickupNotification,
        });
      } catch (e) {
        console.error('[PickupAlarm] 에러:', e);
      }
    }

    init();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [user, addNotification, hasPickupNotification, hasPostPickupNotification, refreshTrigger]);

  return null;
}
