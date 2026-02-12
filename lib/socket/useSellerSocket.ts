/**
 * 판매자용 소켓 훅
 * - 판매자가 마이페이지에 있을 때 실시간 주문 알림 수신
 * - 토스트 알림 표시 + 알림 스토어에 저장
 * - 로그인 시 놓친 대기중 주문도 알림에 추가
 */

'use client';

import { getSocket } from '@/lib/socket/socket';
import { useEffect, useState, useCallback } from 'react';
import useNotificationStore from '@/zustand/notificationStore';
import { fetchSellerOrders } from '@/lib/orders';
import { type OrderProduct, isSendingOrder } from './sendOrder';

// 토스트 알림 타입
export type ToastNotification = {
  items: OrderProduct[];
};

/**
 * 판매자용 소켓 연결 및 알림 관리 훅
 * @param sellerId - 판매자 ID (0이면 연결하지 않음)
 * @returns toasts - 현재 표시 중인 토스트 목록, removeToast - 토스트 제거 함수
 */
export function useSellerSocket(sellerId: number) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const hasOrderNotification = useNotificationStore(
    (state) => state.hasOrderNotification
  );

  // 대기중 주문을 불러와서 알림에 추가하는 함수
  const fetchPendingOrders = useCallback(async () => {
    if (!sellerId) return;

    try {
      const orders = await fetchSellerOrders();
      // 대기중(OS020) 주문만 필터링
      const pendingOrders = orders.filter((order) => order.state === 'OS020');

      for (const order of pendingOrders) {
        // 이미 알림에 있는 주문은 스킵
        if (hasOrderNotification(order._id)) continue;

        // 상품명 목록 생성
        const productNames = order.products
          .map((p) => `${p.name} ${p.quantity}개`)
          .join(', ');

        console.log('[fetchPendingOrders] 알림 추가:', order._id, productNames);
        addNotification({
          type: 'order',
          sellerId,
          userId: 0,
          orderId: order._id,
          text: `새 주문: ${productNames}`,
          productName: order.products.map((p) => p.name).join(', '),
        });
      }
    } catch (e) {
      console.error('[fetchPendingOrders] 주문 조회 실패:', e);
    }
  }, [sellerId, addNotification, hasOrderNotification]);

  // 마운트 시 놓친 대기중 주문 불러오기
  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  useEffect(() => {
    if (!sellerId) return;

    const socket = getSocket();

    // 판매자 전용 방 생성 및 입장
    // 서버가 이전 세션의 user_id를 기억하므로 매번 고유 ID 사용
    const uniqueId = `${sellerId}_${Date.now()}`;

    const setupRoom = () => {
      socket.emit(
        'createRoom',
        {
          roomId: `seller-${sellerId}`,
          user_id: uniqueId,
          hostName: `seller-${sellerId}`,
          roomName: `seller-${sellerId}`,
        },
        () => {
          socket.emit(
            'joinRoom',
            {
              roomId: `seller-${sellerId}`,
              user_id: uniqueId,
              nickName: `판매자`,
            },
            (joinRes: unknown) => {
              void joinRes;
            }
          );
        }
      );
    };

    // 소켓 연결 상태에 따라 방 설정
    if (socket.connected) {
      setupRoom();
    } else {
      socket.once('connect', setupRoom);
    }

    // 메시지 수신 (토스트 표시 + 알림 목록 갱신)
    socket.on('message', (data) => {
      // 자기가 보낸 메시지는 무시 (구매자가 seller 타입일 때 자기 토스트 방지)
      if (isSendingOrder) return;

      if (typeof data.msg === 'string' && data.msg.startsWith('ORDER_DATA:')) {
        try {
          const jsonStr = data.msg.replace('ORDER_DATA:', '');
          const items: OrderProduct[] = JSON.parse(jsonStr);

          // 토스트 알림에 추가 (화면에 실시간 표시)
          setToasts((prev) => [...prev, { items }]);

          // 소켓 데이터로 직접 알림 생성
          const productNames = items
            .map((p) => `${p.name} ${p.quantity}개`)
            .join(', ');
          addNotification({
            type: 'order',
            sellerId,
            userId: 0,
            orderId: Date.now(),
            text: `새 주문: ${productNames}`,
            productName: items.map((p) => p.name).join(', '),
          });
        } catch {
          // 잘못된 데이터면 무시
        }
      }
    });

    return () => {
      // leaveRoom 호출하지 않음 - 판매자는 항상 방에 남아있어야 메시지 수신 가능
      socket.off('message');
    };
  }, [sellerId, fetchPendingOrders]);

  // 토스트 제거 함수 (스와이프 또는 클릭 시)
  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, idx) => idx !== index));
  };

  return { toasts, removeToast };
}
