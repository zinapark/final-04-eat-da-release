'use client';

import { useEffect, useMemo, useState } from 'react';
import OrderCard from '@/app/mypage/orders/OrderCard';
import type {
  SellerOrderData,
  OrderStatus,
  OrderStateCode,
} from '@/app/src/types';
import { orderState } from '@/app/src/types';
import { fetchSellerOrders, updateOrderState } from '@/lib/orders';
import { getUser } from '@/lib/mypage';
import { getTokenPayload } from '@/lib/axios';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import { OrdersSkeleton } from '@/app/mypage/orders/loading';

const statusList: OrderStatus[] = ['대기중', '승인됨', '조리완료', '픽업완료'];

const nextStateMap: Record<string, OrderStateCode> = {
  OS020: 'OS040',
  OS040: 'OS060',
  OS060: 'OS080',
};

const nextStatusTextMap: Record<OrderStatus, string> = {
  대기중: '승인',
  승인됨: '조리 완료',
  조리완료: '픽업 완료',
  픽업완료: '',
  취소됨: '',
};

const pickupTimeMap: Record<string, string> = {
  '9-12': '9:00-12:00',
  '12-16': '12:00-16:00',
  '16-20': '16:00-20:00',
};

const getStatus = (order: SellerOrderData) =>
  orderState[order.state as OrderStateCode] as OrderStatus;

const formatOrderTime = (dateStr: string) =>
  new Date(dateStr)
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/\s/g, ' ');

const formatPickupDate = (date?: string) =>
  date ? date.replace(/-0?/g, '.') : '-';

export const formatPickupTime = (time?: string) =>
  time ? (pickupTimeMap[time] ?? time) : '-';

export default function OrdersClient() {
  const [orders, setOrders] = useState<SellerOrderData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );
  const [sellerName, setSellerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setOrders(await fetchSellerOrders());
    } catch (e) {
      console.error('주문 목록 조회 실패', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const payload = getTokenPayload();
    if (payload) {
      getUser(payload._id).then((user) => {
        if (user) setSellerName(user.name);
      });
    }
  }, []);

  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          const s = getStatus(order);
          acc[s] = (acc[s] ?? 0) + 1;
          return acc;
        },
        {} as Record<OrderStatus, number>
      ),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const base = selectedStatus
      ? orders.filter((order) => getStatus(order) === selectedStatus)
      : orders;
    return [...base].sort((a, b) => {
      const aComplete = a.state === 'OS080' ? 1 : 0;
      const bComplete = b.state === 'OS080' ? 1 : 0;
      return aComplete - bComplete;
    });
  }, [orders, selectedStatus]);

  const handleAdvance = async (orderId: number, currentState: string) => {
    const nextState = nextStateMap[currentState];
    if (!nextState) return;
    try {
      await updateOrderState(orderId, nextState);
      await fetchOrders();
      setModalMessage(`상태가 변경되었습니다.`);
      setShowModal(true);
    } catch (e) {
      console.error('주문 상태 변경 실패', e);
    }
  };

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5 px-5 mt-16 mb-5">
      <div className="grid grid-cols-2 gap-3">
        {statusList.map((status) => (
          <button
            key={status}
            onClick={() =>
              setSelectedStatus(selectedStatus === status ? null : status)
            }
            className={`flex justify-between text-display-1 border border-gray-300 items-center px-3 py-4 rounded-lg ${
              selectedStatus === status ? 'ring-2 ring-eatda-orange' : ''
            }`}
          >
            <span>{status}</span>
            <p className="text-display-1 font-semibold text-eatda-orange">
              {statusCounts[status] ?? 0}건
            </p>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <p className="text-gray-500">주문이 없습니다.</p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const status = getStatus(order);
          return (
            <OrderCard
              key={order._id}
              status={status}
              orderTime={formatOrderTime(order.createdAt)}
              products={order.products.map((p) => ({
                imageSrc: p.image.path,
                dishName: p.name,
                sellerName: p.seller?.name ?? sellerName,
                price: p.price,
                quantity: p.quantity,
              }))}
              customerName={order.user?.name ?? '사용자'}
              pickupDate={formatPickupDate(order.extra?.pickupDate)}
              pickupTime={formatPickupTime(order.extra?.pickupTime)}
              onAdvance={
                status !== '픽업완료'
                  ? () => handleAdvance(order._id, order.state)
                  : undefined
              }
              nextStatusText={nextStatusTextMap[status]}
            />
          );
        })
      )}
      <ConfirmModal
        isOpen={showModal}
        title={modalMessage}
        onConfirm={() => setShowModal(false)}
      />
    </div>
  );
}
