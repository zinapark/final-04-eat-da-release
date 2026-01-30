'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { signup, SignupState } from '@/actions/user';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';

type ClientErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  introduction?: string;
};

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState<SignupState | null, FormData>(signup, null);
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'user' | 'seller'>('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [passwordValue, setPasswordValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const detailAddressRef = useRef<HTMLInputElement>(null);

  const openPostcode = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const daum = (window as any).daum;
    if (!daum) return;
    new daum.Postcode({
      oncomplete: (data: { userSelectedType: string; roadAddress: string; jibunAddress: string }) => {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setAddressValue(addr);
        clearError('address');
        detailAddressRef.current?.focus();
      },
    }).open();
  };

  useEffect(() => {
    if (state?.ok === 1) {
      setModalType('success');
      setModalMessage('회원가입 완료');
      setIsModalOpen(true);
    }
    if (state?.ok === 0 && state.message && !state.errors) {
      setModalType('error');
      setModalMessage(state.message);
      setIsModalOpen(true);
    }
    if (state?.values?.type) {
      setSelectedType(state.values.type as 'user' | 'seller');
    }
    if (state?.values?.address) {
      setAddressValue(state.values.address);
    }
  }, [state]);

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (modalType === 'success') {
      router.push('/login');
    }
  };

  const handleBlur = (field: keyof ClientErrors, value: string) => {
    let error: string | undefined;

    switch (field) {
      case 'name':
        if (!value) error = '이름을 입력해주세요.';
        break;
      case 'email':
        if (!value) error = '이메일을 입력해주세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = '올바른 이메일 형식이 아닙니다.';
        break;
      case 'password':
        if (!value) error = '비밀번호를 입력해주세요.';
        else if (value.length < 8) error = '비밀번호는 8자 이상이어야 합니다.';
        else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) error = '비밀번호는 영문과 숫자를 포함해야 합니다.';
        break;
      case 'confirmPassword':
        if (!value) error = '비밀번호 확인을 입력해주세요.';
        else if (value !== passwordValue) error = '비밀번호가 일치하지 않습니다.';
        break;
      case 'phone':
        if (!value) error = '전화번호를 입력해주세요.';
        break;
      case 'address':
        if (!value) error = '주소를 입력해주세요.';
        break;
      case 'introduction':
        if (!value) error = '자기소개를 입력해주세요.';
        else if (value.length < 100) error = '100자 이상 작성해주세요.';
        break;
    }

    setClientErrors((prev) => ({ ...prev, [field]: error }));
  };

  const clearError = (field: keyof ClientErrors) => {
    setClientErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      <form id="signupForm" action={formAction} noValidate className="flex flex-col gap-5">
        {/* 가입유형 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            가입유형 <span className="text-eatda-orange">*</span>
          </label>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedType('user')}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg border transition-colors ${
                selectedType === 'user'
                  ? 'bg-eatda-orange text-white border-eatda-orange'
                  : 'bg-gray-200 text-gray-800 border-gray-300'
              }`}
            >
              자취생
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('seller')}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg border transition-colors ${
                selectedType === 'seller'
                  ? 'bg-eatda-orange text-white border-eatda-orange'
                  : 'bg-gray-200 text-gray-800 border-gray-300'
              }`}
            >
              주부
            </button>
          </div>
          <input type="hidden" name="type" value={selectedType} />
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            이름 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={state?.values?.name || ''}
            placeholder="박주부"
            onBlur={(e) => handleBlur('name', e.target.value)}
            onChange={() => clearError('name')}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.name && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.name}</p>
          )}
          {!clientErrors.name && state?.ok === 0 && state.errors?.name && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.name.msg}</p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            이메일 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="email"
            name="email"
            defaultValue={state?.values?.email || ''}
            placeholder="example@youremail.com"
            onBlur={(e) => handleBlur('email', e.target.value)}
            onChange={() => clearError('email')}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.email && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.email}</p>
          )}
          {!clientErrors.email && state?.ok === 0 && state.errors?.email && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.email.msg}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            비밀번호 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="안전한 비밀번호를 입력하세요"
            onBlur={(e) => handleBlur('password', e.target.value)}
            onChange={(e) => { setPasswordValue(e.target.value); clearError('password'); }}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.password && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.password}</p>
          )}
          {!clientErrors.password && state?.ok === 0 && state.errors?.password && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.password.msg}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            비밀번호 확인 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 한번 더 입력하세요"
            onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
            onChange={() => clearError('confirmPassword')}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.confirmPassword && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.confirmPassword}</p>
          )}
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            전화번호 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={state?.values?.phone || ''}
            placeholder="010-0000-0000"
            onBlur={(e) => handleBlur('phone', e.target.value)}
            onChange={() => clearError('phone')}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.phone && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.phone}</p>
          )}
          {!clientErrors.phone && state?.ok === 0 && state.errors?.phone && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.phone.msg}</p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            주소 <span className="text-eatda-orange">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={addressValue}
              placeholder="주소를 검색하세요"
              className="flex-1 py-3 border-0 border-b border-gray-400 focus:outline-none placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2 bg-transparent cursor-pointer"
              onClick={openPostcode}
            />
            <button
              type="button"
              onClick={openPostcode}
              className="shrink-0 px-4 py-2 bg-eatda-orange text-white text-display-1 font-semibold rounded-lg hover:opacity-80"
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            name="detailAddress"
            ref={detailAddressRef}
            defaultValue={state?.values?.address || ''}
            placeholder="상세주소를 입력하세요"
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          <input type="hidden" name="address" value={addressValue} />
          {clientErrors.address && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.address}</p>
          )}
          {!clientErrors.address && state?.ok === 0 && state.errors?.address && (
            <p className="text-eatda-orange text-x-small mt-1">{state.errors.address.msg}</p>
          )}
        </div>

        {/* 자기소개 - 주부일 때만 표시 */}
        {selectedType === 'seller' && (
          <div>
            <label className="block text-display-3 font-semibold text-gray-800 mb-2">
              자기소개 <span className="text-eatda-orange">*</span>
            </label>
            <textarea
              name="introduction"
              defaultValue={state?.values?.introduction || ''}
              placeholder="요리를 시작하게 된 계기나 자신 있는 반찬 이야기를 적어주시면 좋아요. (100자 이상)"
              className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2 resize-none overflow-hidden"
              rows={2}
              onBlur={(e) => handleBlur('introduction', e.target.value)}
              onChange={() => clearError('introduction')}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {clientErrors.introduction && (
              <p className="text-eatda-orange text-x-small mt-1">{clientErrors.introduction}</p>
            )}
            {!clientErrors.introduction && state?.ok === 0 && state.errors?.extra && (
              <p className="text-eatda-orange text-x-small mt-1">{state.errors.extra.msg}</p>
            )}
          </div>
        )}
      </form>

      <ConfirmModal
        isOpen={isModalOpen}
        title={modalMessage}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
