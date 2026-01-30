'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, LoginState } from '@/actions/user';
import useUserStore from '@/zustand/userStore';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(login, null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);
  const [clientErrors, setClientErrors] = useState<{ email?: string; password?: string }>({});
  const [modalMessage, setModalMessage] = useState('');

  const handleBlur = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      if (!value) {
        setClientErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setClientErrors((prev) => ({ ...prev, email: '올바른 이메일 형식이 아닙니다.' }));
      } else {
        setClientErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
    if (field === 'password') {
      if (!value) {
        setClientErrors((prev) => ({ ...prev, password: '비밀번호를 입력해주세요.' }));
      } else if (value.length < 8) {
        setClientErrors((prev) => ({ ...prev, password: '비밀번호는 8자 이상이어야 합니다.' }));
      } else {
        setClientErrors((prev) => ({ ...prev, password: undefined }));
      }
    }
  };

  useEffect(() => {
    if (state?.ok === 0 && state.message && !state.errors) {
      setModalMessage(state.message || '');
    }
    if (state?.ok === 1 && state.item) {
      // zustand에 유저 정보 저장
      setUser({
        _id: state.item._id,
        email: state.item.email,
        name: state.item.name,
        type: state.item.type,
        loginType: state.item.loginType,
        image: state.item.image,
        token: {
          accessToken: state.item.token.accessToken,
          refreshToken: state.item.token.refreshToken,
        },
      });
      const redirect = searchParams.get('redirect') || '/home';
      router.replace(redirect);
    }
  }, [state, router, setUser, searchParams]);

  return (
    <>
      <ConfirmModal
        isOpen={!!modalMessage}
        title={modalMessage}
        onConfirm={() => setModalMessage('')}
      />

      <form id="loginForm" action={formAction} noValidate className="flex flex-col gap-5">
        {/* 이메일 입력 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            이메일 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@youremail.com"
            onBlur={(e) => handleBlur('email', e.target.value)}
            onChange={() => setClientErrors((prev) => ({ ...prev, email: undefined }))}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.email && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.email}</p>
          )}
          {!clientErrors.email && state?.ok === 0 && state.errors?.email && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.email.msg}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            비밀번호 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            onBlur={(e) => handleBlur('password', e.target.value)}
            onChange={() => setClientErrors((prev) => ({ ...prev, password: undefined }))}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.password && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.password}</p>
          )}
          {!clientErrors.password && state?.ok === 0 && state.errors?.password && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.password.msg}</p>
          )}
        </div>

        {/* 회원가입 링크 */}
        <div className="text-left">
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="text-display-2 text-gray-600 underline hover:text-gray-800"
          >
            회원가입
          </button>
        </div>

      </form>
    </>
  );
}
