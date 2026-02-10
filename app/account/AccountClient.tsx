'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { getAxios, getTokenPayload } from '@/lib/axios';
import { getUser } from '@/lib/mypage';
import { uploadImages } from '@/lib/banchan';
import useUserStore from '@/zustand/userStore';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';
import AddImage from '@/app/src/components/ui/AddImage';

type ClientErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  detailAddress?: string;
};

export default function AccountClient() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'user' | 'seller'>('user');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [phone, setPhone] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [introductionLength, setIntroductionLength] = useState(0);
  const [profileImageFiles, setProfileImageFiles] = useState<File[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [existingImage, setExistingImage] = useState<{ path: string; name: string } | null>(null);

  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  const detailAddressRef = useRef<HTMLInputElement>(null);

  // 유저 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      const payload = getTokenPayload();
      if (!payload) {
        router.replace('/login');
        return;
      }

      const userInfo = await getUser(payload._id);
      if (!userInfo) {
        router.replace('/login');
        return;
      }

      setUserType(userInfo.type);
      setUserName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
      setAddressValue(userInfo.address || '');
      setDetailAddress(userInfo.extra?.detailAddress || '');
      if (userInfo.extra?.introduction) {
        setIntroduction(userInfo.extra.introduction);
        setIntroductionLength(userInfo.extra.introduction.length);
      }

      // 이미지 처리 (직접 업로드한 이미지만 표시, 기본 아바타 URL은 제외)
      if (userInfo.image) {
        const imagePath = typeof userInfo.image === 'string' ? userInfo.image : userInfo.image.path;
        if (!imagePath.startsWith('http')) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/market', '') || '';
          if (typeof userInfo.image === 'string') {
            setInitialImages([`${apiUrl}${userInfo.image}`]);
            setExistingImage({ path: userInfo.image, name: '' });
          } else {
            setInitialImages([`${apiUrl}${userInfo.image.path}`]);
            setExistingImage(userInfo.image);
          }
        }
      }

      setLoading(false);
    };

    loadUser();
  }, [router]);

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

  const handleBlur = (field: keyof ClientErrors, value: string) => {
    let error: string | undefined;

    switch (field) {
      case 'email':
        if (!value) error = '이메일을 입력해주세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = '올바른 이메일 형식이 아닙니다.';
        break;
      case 'password':
        if (value && value.length < 8) error = '비밀번호는 8자 이상이어야 합니다.';
        else if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) error = '비밀번호는 영문과 숫자를 포함해야 합니다.';
        break;
      case 'confirmPassword':
        if (passwordValue && !value) error = '비밀번호 확인을 입력해주세요.';
        else if (value && value !== passwordValue) error = '비밀번호가 일치하지 않습니다.';
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
    }

    setClientErrors((prev) => ({ ...prev, [field]: error }));
  };

  const clearError = (field: keyof ClientErrors) => {
    setClientErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleProfileImageChange = (_images: string[], files: File[]) => {
    setProfileImageFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // 전체 검증
    const newErrors: ClientErrors = {};
    if (!email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
    if (passwordValue) {
      if (passwordValue.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(passwordValue)) newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
      if (!confirmPasswordValue) newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      else if (confirmPasswordValue !== passwordValue) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!phone) newErrors.phone = '전화번호를 입력해주세요.';

    setClientErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) return;

    setSubmitting(true);

    try {
      const payload = getTokenPayload();
      if (!payload) return;

      // 이미지 업로드
      let profileImage = existingImage;
      if (profileImageFiles.length > 0) {
        const uploaded = await uploadImages(profileImageFiles);
        if (uploaded.length > 0) {
          profileImage = uploaded[0];
        }
      }

      // 변경 데이터 구성
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = {
        email,
        phone,
        address: addressValue,
        extra: {
          detailAddress,
          ...(userType === 'seller' ? { introduction } : {}),
        },
      };

      if (passwordValue) {
        updateData.password = passwordValue;
      }

      if (profileImage) {
        updateData.image = profileImage;
      }

      const axios = getAxios();
      const response = await axios.patch(`/users/${payload._id}`, updateData);

      if (response.data.ok) {
        // Zustand 업데이트
        if (user) {
          setUser({
            ...user,
            email,
            image: profileImage?.path || user.image,
          });
        }

        setModalType('success');
        setModalMessage('수정이 완료되었습니다.');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      setModalType('error');
      setModalMessage('수정에 실패했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (modalType === 'success') {
      router.push('/mypage');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-display-2">로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

      <form id="account-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* 가입유형 (변경 불가) */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            가입유형
          </label>
          <div className="flex gap-2.5">
            <div
              className={`flex-1 py-3 text-sm font-semibold rounded-lg text-center border ${
                userType === 'user'
                  ? 'bg-eatda-orange text-white border-eatda-orange'
                  : 'bg-gray-200 text-gray-800 border-gray-300'
              }`}
            >
              자취생
            </div>
            <div
              className={`flex-1 py-3 text-sm font-semibold rounded-lg text-center border ${
                userType === 'seller'
                  ? 'bg-eatda-orange text-white border-eatda-orange'
                  : 'bg-gray-200 text-gray-800 border-gray-300'
              }`}
            >
              주부
            </div>
          </div>
          <p className="text-eatda-orange text-x-small mt-1">유저 타입은 변경할 수 없습니다.</p>
        </div>

        {/* 이름 (변경 불가) */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            이름
          </label>
          <input
            type="text"
            value={userName}
            disabled
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none text-gray-500 text-display-2 bg-transparent"
          />
          <p className="text-eatda-orange text-x-small mt-1">이름은 변경할 수 없습니다.</p>
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            이메일 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="email"
            autoComplete="off"
            value={email}
            placeholder="example@youremail.com"
            onBlur={(e) => handleBlur('email', e.target.value)}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.email && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.email}</p>
          )}
        </div>

        {/* 비밀번호 (선택) */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            비밀번호
          </label>
          <input
            type="password"
            autoComplete="off"
            value={passwordValue}
            placeholder="변경할 비밀번호를 입력하세요"
            onBlur={(e) => handleBlur('password', e.target.value)}
            onChange={(e) => { setPasswordValue(e.target.value); clearError('password'); }}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.password && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.password}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        {passwordValue && (
          <div>
            <label className="block text-display-3 font-semibold text-gray-800 mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              autoComplete="off"
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
        )}

        {/* 전화번호 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            전화번호 <span className="text-eatda-orange">*</span>
          </label>
          <input
            type="tel"
            autoComplete="off"
            value={phone}
            placeholder="010-0000-0000"
            onBlur={(e) => handleBlur('phone', e.target.value)}
            onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.phone && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.phone}</p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            주소
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
          {clientErrors.address && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.address}</p>
          )}
        </div>

        {/* 상세주소 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            상세주소
          </label>
          <input
            type="text"
            autoComplete="off"
            ref={detailAddressRef}
            value={detailAddress}
            placeholder="상세주소를 입력하세요"
            onBlur={(e) => handleBlur('detailAddress', e.target.value)}
            onChange={(e) => { setDetailAddress(e.target.value); clearError('detailAddress'); }}
            className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
          />
          {clientErrors.detailAddress && (
            <p className="text-eatda-orange text-x-small mt-1">{clientErrors.detailAddress}</p>
          )}
        </div>

        {/* 자기소개 - 주부일 때만 표시 */}
        {userType === 'seller' && (
          <div>
            <label className="block text-display-3 font-semibold text-gray-800 mb-2">
              자기소개
            </label>
            <textarea
              value={introduction}
              placeholder="요리를 시작하게 된 계기나 자신 있는 반찬 이야기를 적어주시면 좋아요. (100자 이상)"
              className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 focus:placeholder:text-transparent text-gray-800 text-display-2 placeholder:text-display-2 resize-none overflow-hidden"
              rows={3}
              onChange={(e) => {
                setIntroduction(e.target.value);
                setIntroductionLength(e.target.value.length);
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <p className={`text-x-small mt-1 ${introductionLength >= 100 ? 'text-gray-600' : 'text-eatda-orange'}`}>
              {introductionLength}/100
            </p>
          </div>
        )}

        {/* 프로필 이미지 */}
        <div>
          <label className="block text-display-3 font-semibold text-gray-800 mb-2">
            프로필 이미지
          </label>
          <AddImage
            onChange={handleProfileImageChange}
            maxImages={1}
            initialImages={initialImages}
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
