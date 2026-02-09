'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { signup, SignupState } from '@/actions/user';
import useUserStore from '@/zustand/userStore';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import AddImage from '@/app/src/components/ui/AddImage';
import { uploadImages } from '@/lib/banchan';

type ClientErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  detailAddress?: string;
  introduction?: string;
};

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState<SignupState | null, FormData>(signup, null);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [selectedType, setSelectedType] = useState<'user' | 'seller'>('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const detailAddressRef = useRef<HTMLInputElement>(null);
  const introductionRef = useRef<HTMLTextAreaElement>(null);
  const [profileImageFiles, setProfileImageFiles] = useState<File[]>([]);
  const [introductionLength, setIntroductionLength] = useState(0);
  const [introductionRows, setIntroductionRows] = useState(2);

  // 화면 너비에 따라 placeholder 줄 수 계산
  const calculatePlaceholderRows = () => {
    const textarea = introductionRef.current;
    if (!textarea || textarea.value) return;

    const placeholder = "요리를 시작하게 된 계기나 자신 있는 반찬 이야기를 적어주시면 좋아요. (100자 이상)";
    const style = getComputedStyle(textarea);
    const font = `${style.fontSize} ${style.fontFamily}`;

    // canvas로 텍스트 너비 측정
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = font;
    const textWidth = ctx.measureText(placeholder).width;
    const textareaWidth = textarea.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight);

    const rows = textWidth > textareaWidth ? 2 : 1;
    setIntroductionRows(rows);
  };

  useEffect(() => {
    // 약간의 지연을 주어 DOM이 완전히 렌더링된 후 계산
    const timer = setTimeout(calculatePlaceholderRows, 100);
    window.addEventListener('resize', calculatePlaceholderRows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePlaceholderRows);
    };
  }, [selectedType]);

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
    if (state?.values?.introduction) {
      setIntroductionLength(state.values.introduction.length);
    }
  }, [state]);

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    if (modalType === 'success' && state?.item) {
      const item = state.item;

      // Zustand에 유저 정보 저장 (자동 로그인)
      setUser({
        _id: item._id,
        email: item.email,
        name: item.name,
        type: item.type,
        loginType: item.loginType,
        image: item.image,
        token: {
          accessToken: item.token.accessToken,
          refreshToken: item.token.refreshToken,
        },
      });

      // 유저 주소를 API로 가져와서 localStorage에 저장
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${item._id}/address`,
          {
            headers: {
              'Authorization': `Bearer ${item.token.accessToken}`,
              'Content-Type': 'application/json',
              'Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID || '',
            },
          }
        );
        const data = await res.json();
        if (data.ok && data.item?.address) {
          localStorage.setItem('user-address', data.item.address);
        }
      } catch (error) {
        console.error('주소 정보 가져오기 실패:', error);
      }

      router.replace('/home');
    } else if (modalType === 'success') {
      // 자동 로그인 데이터가 없으면 로그인 페이지로
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
      case 'detailAddress':
        if (!value) error = '상세주소를 입력해주세요.';
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

  const handleProfileImageChange = (_images: string[], files: File[]) => {
    setProfileImageFiles(files);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (profileImageFiles.length > 0) {
      try {
        const uploaded = await uploadImages(profileImageFiles);
        if (uploaded.length > 0) {
          formData.set('profileImage', JSON.stringify(uploaded[0]));
        }
      } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error);
      }
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      <form id="signupForm" onSubmit={handleFormSubmit} noValidate className="flex flex-col gap-5">
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
            value={passwordValue}
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
            value={confirmPasswordValue}
            placeholder="비밀번호를 한번 더 입력하세요"
            onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
            onChange={(e) => { setConfirmPasswordValue(e.target.value); clearError('confirmPassword'); }}
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
            defaultValue={state?.values?.detailAddress || ''}
            placeholder="상세주소를 입력하세요"
            onBlur={(e) => handleBlur('detailAddress', e.target.value)}
            onChange={() => clearError('detailAddress')}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          <input type="hidden" name="address" value={addressValue} />
          {clientErrors.address && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.address}</p>
          )}
          {clientErrors.detailAddress && !clientErrors.address && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.detailAddress}</p>
          )}
          {!clientErrors.address && !clientErrors.detailAddress && state?.ok === 0 && state.errors?.address && (
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
              ref={introductionRef}
              name="introduction"
              defaultValue={state?.values?.introduction || ''}
              placeholder="요리를 시작하게 된 계기나 자신 있는 반찬 이야기를 적어주시면 좋아요. (100자 이상)"
              className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 focus:placeholder:text-transparent text-gray-800 text-display-2 placeholder:text-display-2 resize-none overflow-hidden"
              rows={introductionRows}
              onFocus={() => setIntroductionRows(1)}
              onBlur={(e) => {
                handleBlur('introduction', e.target.value);
                if (!e.target.value) calculatePlaceholderRows();
              }}
              onChange={(e) => { setIntroductionLength(e.target.value.length); clearError('introduction'); }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <p className={`text-x-small mt-1 ${introductionLength >= 100 ? 'text-gray-600' : 'text-eatda-orange'}`}>
              {introductionLength}/100
            </p>
            {clientErrors.introduction && (
              <p className="text-eatda-orange text-x-small mt-1">{clientErrors.introduction}</p>
            )}
            {!clientErrors.introduction && state?.ok === 0 && state.errors?.extra && (
              <p className="text-eatda-orange text-x-small mt-1">{state.errors.extra.msg}</p>
            )}
          </div>
        )}

        {/* 프로필 이미지 등록 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            프로필 이미지 등록
          </label>
          <AddImage
            onChange={handleProfileImageChange}
            maxImages={1}
            showLabel={false}
          />
        </div>
      </form>

      <ConfirmModal
        isOpen={isModalOpen}
        title={modalMessage}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
