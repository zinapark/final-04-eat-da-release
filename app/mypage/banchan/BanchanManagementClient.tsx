'use client';

import { useEffect, useState } from 'react';
import BanchanCard from '@/app/mypage/banchan/BanchanCard';
import { getAxios } from '@/lib/axios';
import { BanchanItem } from '@/app/src/types';
import { BanchanManagementSkeleton } from '@/app/mypage/banchan/loading';

export default function BanchanManagementClient() {
  const [items, setItems] = useState<BanchanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const axios = getAxios();
        const response = await axios.get('/seller/products');

        if (response.data.ok) {
          setItems(response.data.item || []);
        }
      } catch (error) {
        console.error('반찬 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <BanchanManagementSkeleton />;
  }

  return (
    <>
      <section className="px-5 mt-15 mb-24 flex flex-1 flex-col min-h-[calc(100vh-10rem)]">
        <p className="text-display-3 font-semibold text-gray-800">
          등록된 반찬 ({items.length})
        </p>
        {items.length > 0 ? (
          <div className="flex flex-col">
            {items.map((item) => (
              <BanchanCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-display-3 text-gray-600">
            <div className="text-center flex flex-col gap-2">
              <p>등록된 반찬이 없습니다.</p>
              <p>새 반찬을 등록하여 판매를 시작해보세요.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
