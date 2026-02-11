import dayjs from 'dayjs';
import type { PurchaseData } from '@/app/src/types';
import type { Notification } from '@/zustand/notificationStore';

type NotificationActions = {
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'> & {
      createdAt?: string;
    }
  ) => void;
  hasPickupNotification: (orderId: number) => boolean;
  hasPostPickupNotification: (orderId: number) => boolean;
};

// pickupTime 파싱: "12-16" → {h:12, m:0}, "14:35-16" → {h:14, m:35}
function parsePickupStart(pickupTime: string): { h: number; m: number } {
  const start = pickupTime.split('-')[0];
  if (start.includes(':')) {
    const [h, m] = start.split(':').map(Number);
    return { h, m };
  }
  return { h: parseInt(start), m: 0 };
}

// 픽업 전 알림 메시지 생성
function getPickupMessage(): string {
  return '주문하신 반찬을 픽업할 시간입니다!';
}

// 픽업 후 알림 메시지 생성
function getPostPickupMessage(pickupDate: string, pickupTime: string): string {
  const date = dayjs(pickupDate).format('M월 D일');
  const [start, end] = pickupTime.split('-');
  return `음식은 잘 받아보셨나요?\n픽업 일시: ${date} ${start}시-${end}시`;
}

// 픽업 종료 후 알림 (픽업 전 알림과 독립적으로 동작)
function addPostPickupAlarm(
  purchase: PurchaseData,
  userId: number,
  actions: NotificationActions
): void {
  if (actions.hasPostPickupNotification(purchase._id)) return;

  const { pickupDate, pickupTime } = purchase.extra;
  const productNames = purchase.products.map((p) => p.name);
  const productName = productNames.join(', ');

  const { h, m } = parsePickupStart(pickupTime);
  const pickupStartTime = dayjs(pickupDate).hour(h).minute(m).second(0);

  actions.addNotification({
    type: 'pickup-done',
    sellerId: 0,
    userId,
    orderId: purchase._id,
    text: getPostPickupMessage(pickupDate, pickupTime),
    productName,
    createdAt: pickupStartTime.toISOString(),
  });
}

// 픽업 전 알림 스케줄링 (타이머 ID 반환, 없으면 null)
function schedulePrePickupAlarm(
  purchase: PurchaseData,
  userId: number,
  actions: NotificationActions
): ReturnType<typeof setTimeout> | null {
  if (actions.hasPickupNotification(purchase._id)) return null;

  const { pickupDate, pickupTime } = purchase.extra;
  const { h, m } = parsePickupStart(pickupTime);
  const pickupStart = dayjs(pickupDate).hour(h).minute(m).second(0);
  const now = dayjs();

  // 이미 픽업 시작 지났으면 전 알림 없음
  if (now.isAfter(pickupStart)) return null;

  const remaining = pickupStart.diff(now, 'minute');
  const productNames = purchase.products.map((p) => p.name);
  const productName = productNames.join(', ');

  // 1시간 이내면 즉시 알림
  if (remaining <= 60) {
    actions.addNotification({
      type: 'pickup',
      sellerId: 0,
      userId,
      orderId: purchase._id,
      text: getPickupMessage(),
      productName,
    });
    return null;
  }

  // 1시간 이상 남았으면 (remaining - 60)분 후에 알림 예약
  const delayMs = (remaining - 60) * 60 * 1000;
  return setTimeout(() => {
    if (actions.hasPickupNotification(purchase._id)) return;
    actions.addNotification({
      type: 'pickup',
      sellerId: 0,
      userId,
      orderId: purchase._id,
      text: getPickupMessage(),
      productName,
    });
  }, delayMs);
}

// 단일 주문에 대해 알림 처리 (타이머 ID 배열 반환)
function schedulePickupAlarm(
  purchase: PurchaseData,
  userId: number,
  actions: NotificationActions
): ReturnType<typeof setTimeout>[] {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const { pickupDate, pickupTime } = purchase.extra;
  const { h, m } = parsePickupStart(pickupTime);
  const pickupStart = dayjs(pickupDate).hour(h).minute(m).second(0);
  const now = dayjs();

  // 픽업 시작 시간이 지났으면 즉시 알림
  if (now.isAfter(pickupStart)) {
    addPostPickupAlarm(purchase, userId, actions);
    return timers;
  }

  // 아직 픽업 시간 전 → 리마인더 설정
  const preTimer = schedulePrePickupAlarm(purchase, userId, actions);
  if (preTimer) timers.push(preTimer);

  // 픽업 시작 시간에 pickup-done 알림 예약
  if (!actions.hasPostPickupNotification(purchase._id)) {
    const delayMs = pickupStart.diff(now, 'millisecond');
    const postTimer = setTimeout(() => {
      addPostPickupAlarm(purchase, userId, actions);
    }, delayMs);
    timers.push(postTimer);
  }

  return timers;
}

// 모든 주문에 대해 알림 설정 (취소됨만 제외)
// 반환값: 예약된 타이머 ID 배열 (클린업용)
export function schedulePickupAlarms(
  purchases: PurchaseData[],
  userId: number,
  actions: NotificationActions
): ReturnType<typeof setTimeout>[] {
  const targets = purchases.filter((p) => p.state !== 'OS310');
  const timers: ReturnType<typeof setTimeout>[] = [];
  for (const p of targets) {
    timers.push(...schedulePickupAlarm(p, userId, actions));
  }
  return timers;
}
