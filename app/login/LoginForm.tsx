'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginState } from '@/actions/user';
import useUserStore from '@/zustand/userStore';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(login, null);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
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
      router.replace('/home');
    }
  }, [state, router, setUser]);

  return (
    <>
      {/* 로그인 실패 메시지 */}
      {state?.ok === 0 && state.message && !state.errors && (
        <div className="text-center py-4">
          <p className="text-eatda-orange">{state.message}</p>
        </div>
      )}

      <form id="loginForm" action={formAction} className="flex flex-col gap-5">
        {/* 이메일 입력 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            이메일 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@youremail.com"
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {state?.ok === 0 && state.errors?.email && (
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
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {state?.ok === 0 && state.errors?.password && (
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
