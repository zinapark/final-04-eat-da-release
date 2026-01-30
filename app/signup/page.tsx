'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/src/components/common/Header';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import ConfirmModal from '@/app/src/components/ui/ConfirmModal';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    introduction: '' // 자기소개 추가
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    introduction: '' // 자기소개 에러 추가
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    address: false,
    introduction: false // 자기소개 touched 추가
  });
  const [selectedType, setSelectedType] = useState<'individual' | 'business'>('individual');

  // 모달 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  const validateName = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '필수 입력 사항입니다';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    if (value.length < 8) return '비밀번호는 8자 이상 영문과 숫자로 이루어져야 합니다';
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) return '비밀번호는 8자 이상 영문과 숫자로 이루어져야 합니다';
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    if (value !== formData.password) return '비밀번호가 일치하지 않습니다';
    return '';
  };

  const validatePhone = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    return '';
  };

  const validateAddress = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    return '';
  };

  const validateIntroduction = (value: string) => {
    if (!value) return '필수 입력 사항입니다';
    if (value.length < 100) return '100자 이상 작성해주세요';
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = '';
    const value = formData[field as keyof typeof formData];

    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'introduction':
        error = validateIntroduction(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      address: true,
      introduction: true
    });

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      introduction: selectedType === 'business' ? validateIntroduction(formData.introduction) : ''
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors) {
      console.log('회원가입 시도:', { ...formData, type: selectedType });
      // 회원가입 API 호출
      // TODO: 실제 API 호출 후 성공 시 모달 표시
      setModalTitle('회원가입 완료');
      setModalDescription('');
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    
    // "회원가입 완료" 모달이었으면 로그인 페이지로 이동
    if (modalTitle === '회원가입 완료') {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header 컴포넌트 */}
      <Header title="회원가입" showBackButton />

      {/* 헤더 높이만큼 여백 */}
      <div className="h-[60px]"></div>

      {/* 상단 컨텐츠 */}
      <div className="flex-1 px-5 py-8 overflow-y-auto pb-32">
        <div className="max-w-md mx-auto">
          <form id="signupForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 가입유형 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                가입유형 <span className="text-eatda-orange">*</span>
              </label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedType('individual')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg border transition-colors ${
                    selectedType === 'individual'
                      ? 'bg-eatda-orange text-white border-eatda-orange'
                      : 'bg-gray-200 text-gray-800 border-gray-300'
                  }`}
                >
                  자취생
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('business')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg border transition-colors ${
                    selectedType === 'business'
                      ? 'bg-eatda-orange text-white border-eatda-orange'
                      : 'bg-gray-200 text-gray-800 border-gray-300'
                  }`}
                >
                  주부
                </button>
              </div>
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                이름 <span className="text-eatda-orange">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="박주부"
                className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
              />
              {touched.name && errors.name && (
                <p className="text-eatda-orange text-x-small mt-1">{errors.name}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                이메일 <span className="text-eatda-orange">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="example@youremail.com"
                className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
              />
              {touched.email && errors.email && (
                <p className="text-eatda-orange text-x-small mt-1">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                비밀번호 <span className="text-eatda-orange">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="안전한 비밀번호를 입력하세요"
                className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
              />
              {touched.password && errors.password && (
                <p className="text-eatda-orange text-x-small mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                비밀번호 확인 <span className="text-eatda-orange">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="비밀번호를 한번 더 입력하세요"
                className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-eatda-orange text-x-small mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                전화번호 <span className="text-eatda-orange">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="010-0000-0000"
                className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
              />
              {touched.phone && errors.phone && (
                <p className="text-eatda-orange text-x-small mt-1">{errors.phone}</p>
              )}
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                주소 <span className="text-eatda-orange">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="서울특별시 강남구 도곡동"
                className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2"
              />
              {touched.address && errors.address && (
                <p className="text-eatda-orange text-x-small mt-1">{errors.address}</p>
              )}
            </div>

            {/* 자기소개 - 주부일 때만 표시 */}
            {selectedType === 'business' && (
              <div>
                <label className="block text-display-3 font-semibold text-gray-800 mb-2">
                  자기소개 <span className="text-eatda-orange">*</span>
                </label>
                <textarea
                  value={formData.introduction}
                  onChange={(e) => {
                    handleChange('introduction', e.target.value);
                    // 자동 높이 조절
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onBlur={() => handleBlur('introduction')}
                  placeholder="요리를 시작하게 된 계기나 자신 있는 반찬 이야기를 적어주시면 좋아요. (100자 이상)"
                  className="w-full py-3 border-0 border-b border-gray-400 focus:outline-none focus:border-gray-600 placeholder:text-gray-500 text-gray-800 text-display-2 placeholder:text-display-2 resize-none overflow-hidden"
                  rows={2}
                />
                {touched.introduction && errors.introduction && (
                  <p className="text-eatda-orange text-x-small mt-1">{errors.introduction}</p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* BottomFixedButton 컴포넌트 */}
      <BottomFixedButton as="button" formId="signupForm">
        회원가입
      </BottomFixedButton>

      {/* ConfirmModal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title={modalTitle}
        description={modalDescription}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}