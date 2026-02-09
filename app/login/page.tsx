import Header from '@/app/src/components/common/Header';
import LoginForm from './LoginForm';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="로그인" showBackButton />
      <div className="h-[60px]"></div>
      <div className="flex-1 px-5 py-8 overflow-y-auto pb-32 w-full max-w-[744px] min-w-[390px] mx-auto">
          <Suspense fallback={<div className="text-center text-gray-600">로딩 중...</div>}>
            <LoginForm />
          </Suspense>
      </div>
      <BottomFixedButton as="button" formId="loginForm">
        로그인
      </BottomFixedButton>
    </div>
  );
}
