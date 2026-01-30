'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import Header from '@/app/src/components/common/Header';

// 더미 사용자 데이터
const defaultUserData = {
  name: '박주부',
  email: 'jubu@gmail.com',
  phone: '010-0000-0000',
  address: '서울특별시 강남구 논현동',
  type: 'individual' as 'individual' | 'business',
};

export default function AccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: defaultUserData.email,
    password: '',
    confirmPassword: '',
    phone: defaultUserData.phone,
    address: defaultUserData.address,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const validateEmail = (value: string) => {
    if (!value) return '이메일을 입력해주세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return '올바른 이메일 형식이 아닙니다.';
    return '';
  };

  const validatePassword = (value: string) => {
    // 비밀번호는 선택 사항 (변경 시에만 입력)
    if (!value) return '';
    if (value.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.';
    return '';
  };

  const validateConfirmPassword = (value: string, password: string) => {
    // 비밀번호를 입력했을 때만 확인 검사
    if (!password) return '';
    if (!value) return '비밀번호 확인을 입력해주세요.';
    if (value !== password) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const validatePhone = (value: string) => {
    if (!value) return '변경하실 전화번호를 입력해 주세요.';
    return '';
  };

  const validateAddress = (value: string) => {
    if (!value) return '변경하실 주소를 입력해 주세요.';
    return '';
  };

  const handleBlur = (field: string) => {
    let error = '';
    const value = formData[field as keyof typeof formData];

    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 메시지 초기화
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      ),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (!hasErrors) {
      console.log('회원정보 수정:', formData);
      router.push('/mypage');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-5 py-20 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* 헤더 */}
          <Header title="개인 정보 설정" />

          <form
            id="account-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* 회원유형 (변경 불가) */}
            <div>
              <div className="flex gap-3">
                <div
                  className={`flex-1 py-3 text-sm font-medium rounded-lg text-center ${
                    defaultUserData.type === 'individual'
                      ? 'bg-eatda-orange text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  자취생
                </div>
                <div
                  className={`flex-1 py-3 text-sm font-medium rounded-lg text-center ${
                    defaultUserData.type === 'business'
                      ? 'bg-eatda-orange text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  주부
                </div>
              </div>
              <p className="text-eatda-orange text-xs mt-2">
                유저 타입은 변경할 수 없습니다.
              </p>
            </div>

            {/* 이름 (변경 불가) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={defaultUserData.name}
                disabled
                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent text-gray-900 text-sm"
              />
              <p className="text-eatda-orange text-xs mt-2">
                이름은 변경할 수 없습니다.
              </p>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="example@youremail.com"
                className="w-full py-3 border-0 border-b border-gray-400 text-gray-800 text-display-2 focus:outline-none placeholder:text-gray-600 placeholder:text-display-2"
              />
              {errors.email && (
                <p className="text-xs mt-2 text-eatda-orange">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 (선택) */}
            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                  비밀번호 <span className="text-eatda-orange">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="변경하실 비밀번호를 입력하세요"
                  className="w-full py-3 border-0 border-b border-gray-400 text-gray-800 text-display-2 focus:outline-none placeholder:text-gray-600 placeholder:text-display-2"
                />
                {errors.password && (
                  <p className="text-eatda-orange text-x-small mt-2">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange('confirmPassword', e.target.value)
                  }
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="변경하실 비밀번호를 입력하세요"
                  className="w-full py-3 border-0 border-b border-gray-400 text-gray-800 text-display-2 focus:outline-none placeholder:text-gray-600 placeholder:text-display-2"
                />
                {errors.confirmPassword && (
                  <p className="text-eatda-orange text-x-small mt-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="010-0000-0000"
                className="w-full py-3 border-0 border-b border-gray-400 text-gray-800 text-display-2 focus:outline-none placeholder:text-gray-600 placeholder:text-display-2"
              />
              {errors.phone && (
                <p className="text-xs mt-2 text-eatda-orange">{errors.phone}</p>
              )}
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="서울특별시 강남구 도곡동"
                className="w-full py-3 border-0 border-b border-gray-400 text-gray-800 text-display-2 focus:outline-none placeholder:text-gray-600 placeholder:text-display-2"
              />
              {errors.address && (
                <p className="text-xs mt-2 text-eatda-orange">
                  {errors.address}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <BottomFixedButton as="button" formId="account-form">
        변경 완료
      </BottomFixedButton>
    </div>
  );
}
