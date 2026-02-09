// 구매자가 결제 완료 시 판매자에게 실시간 알림 전송
import { getSocket } from '@/lib/socket/socket';

// 주문 상품 타입
export type OrderProduct = {
  name: string;
  quantity: number;
};

// 판매자에게 주문 알림을 전송하는 함수
export function sendOrder(
  sellerId: number,
  products: OrderProduct[]
): Promise<void> {
  return new Promise((resolve) => {
    const socket = getSocket();

    const send = () => {
      socket.emit(
        'joinRoom',
        {
          roomId: `seller-${sellerId}`,
          user_id: 'buyer',
          nickName: '주문알림',
        },
        (response: { ok: boolean; message?: string }) => {
          if (response.ok) {
            const orderData = JSON.stringify(products);
            socket.emit('message', `ORDER_DATA:${orderData}`);

            // 메시지 전송 후 방에서 퇴장
            setTimeout(() => {
              socket.emit('leaveRoom');
              resolve();
            }, 500);
          } else {
            resolve();
          }
        }
      );
    };

    // 소켓 연결 상태에 따라 즉시 전송 또는 연결 후 전송
    if (socket.connected) {
      send();
    } else {
      socket.once('connect', send);
    }
  });
}
