'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/src/components/common/Header';
import StarItem from '@/app/src/components/ui/StarItem';
import GrayButton from '@/app/src/components/ui/GrayButton';

export default function ReviewManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');

  return (
    <div className="min-h-screen bg-white">
      
      <div className="pb-[80px]">
        <Header 
          title="리뷰관리" 
          showBackButton 
          showSearch 
          showCart 
        />
      </div>

      {/* 탭 */}
      <div className="px-5 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors border ${
              activeTab === 'available'
                ? 'bg-eatda-orange text-white border-eatda-orange'
                : 'bg-gray-200 text-gray-900 border-gray-300'
            }`}
          >
            작성 가능한 리뷰
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors border ${
              activeTab === 'my'
                ? 'bg-eatda-orange text-white border-eatda-orange'
                : 'bg-gray-200 text-gray-900 border-gray-300'
            }`}
          >
            내 리뷰
          </button>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div>
        {activeTab === 'available' ? (
          // 작성 가능한 리뷰 탭
          <div>
            {/* 리뷰 아이템 1 */}
            <div className="px-5 py-4">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    입에서 녹는 소고기 장조림
                  </h3>
                  <p className="text-sm text-eatda-orange">
                    김미숙 주부 9단
                  </p>
                  <p className="text-xs text-gray-500">2026.01.10 구매완료</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/review/write')}
                className="w-full py-3 bg-eatda-orange text-white font-medium rounded-md"
              >
                리뷰 쓰기
              </button>
              <div className="border-b border-gray-300  mt-4"></div>
            </div>

            {/* 리뷰 아이템 2 */}
            <div className="px-5 py-4">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    얼큰한 김치찌개
                  </h3>
                  <p className="text-sm text-eatda-orange">
                    김미숙 주부 9단
                  </p>
                  <p className="text-xs text-gray-500">2026.01.10 구매완료</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/review/write')}
                className="w-full py-3 bg-eatda-orange text-white font-medium rounded-md"
              >
                리뷰 쓰기
              </button>
              <div className="border-b border-gray-300  mt-4"></div>
            </div>

            {/* 리뷰 아이템 3 */}
            <div className="px-5 py-4">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    얼큰한 김치찌개
                  </h3>
                  <p className="text-sm text-eatda-orange">
                    김미숙 주부 9단
                  </p>
                  <p className="text-xs text-gray-500">2026.01.10 구매완료</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/review/write')}
                className="w-full py-3 bg-eatda-orange text-white font-medium rounded-md"
              >
                리뷰 쓰기
              </button>
              <div className="border-b border-gray-300  mt-4"></div>
            </div>
          </div>
        ) : (
          // 내 리뷰 탭
          <div>
            {/* 내 리뷰 아이템 1 */}
            <div className="px-5 py-4">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    입에서 녹는 소고기 장조림
                  </h3>
                  <p className="text-sm text-eatda-orange">김미숙 주부 9단</p>
                  
                  {/* 별점 */}
                  <div className="py-1">
                    <StarItem 
                      rating={1}
                      onRatingChange={() => {}}
                      size={16}
                      editable={false}
                    />
                  </div>
                  
                  {/* 리뷰 내용 */}
                  <p className="text-sm text-gray-900">돼지고기 맛있어요.</p>
                </div>
              </div>

              {/* 버튼 - GrayButton 컴포넌트 사용 */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <GrayButton 
                    text="수정하기" 
                    onClick={() => router.push('/review/edit')} 
                  />
                </div>
                <div className="flex-1">
                  <GrayButton 
                    text="삭제하기" 
                    onClick={() => {
                      // TODO: 삭제 API 호출
                      console.log('리뷰 삭제');
                    }} 
                  />
                </div>
              </div>
              <div className="border-b border-gray-300  mt-4"></div>
            </div>

            {/* 내 리뷰 아이템 2 */}
            <div className="px-5 py-4">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    입에서 녹는 소고기 장조림
                  </h3>
                  <p className="text-sm text-eatda-orange">김미숙 주부 9단</p>
                  
                  {/* 별점 */}
                  <div className="py-1">
                    <StarItem 
                      rating={1}
                      onRatingChange={() => {}}
                      size={16}
                      editable={false}
                    />
                  </div>
                  
                  {/* 리뷰 내용 */}
                  <p className="text-sm text-gray-900">돼지고기 맛있어요.</p>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <GrayButton 
                    text="수정하기" 
                    onClick={() => router.push('/review/edit')} 
                  />
                </div>
                <div className="flex-1">
                  <GrayButton 
                    text="삭제하기" 
                    onClick={() => {
                      console.log('리뷰 삭제');
                    }} 
                  />
                </div>
              </div>
              <div className="border-b border-gray-300  mt-4"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}