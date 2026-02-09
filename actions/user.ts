'use server';

import { getAxios } from '@/lib/axios';

// 구독권 3종 데이터
const subscriptionProducts = [
  {
    name: '가볍게 잇는 집밥',
    price: 15000,
    quantity: 999,
    content: '주 2~3회만 집밥을 먹는 분에게 추천! 주 1회 픽업, 픽업당 반찬 3종 제공',
    extra: {
      category: ['subscription'],
      categoryLabel: '구독권',
      frequency: '주 1회',
      portions: '픽업당 반찬 3종',
      isSubscription: true,
    },
  },
  {
    name: '생활에 자리 잡은 집밥',
    price: 28000,
    quantity: 999,
    content: '평일 저녁을 자주 집에서 먹는 분에게 추천! 주 2회 픽업, 픽업당 반찬 3~4종 제공',
    extra: {
      category: ['subscription'],
      categoryLabel: '구독권',
      frequency: '주 2회',
      portions: '픽업당 반찬 3~4종',
      isSubscription: true,
    },
  },
  {
    name: '식탁을 맡기는 집밥',
    price: 39000,
    quantity: 999,
    content: '거의 매일 집밥을 먹는 자취생에게 추천! 주 3회 픽업, 픽업당 반찬 4종 제공',
    extra: {
      category: ['subscription'],
      categoryLabel: '구독권',
      frequency: '주 3회',
      portions: '픽업당 반찬 4종',
      isSubscription: true,
    },
  },
];

// 판매자 회원가입 시 구독권 3종 자동 등록
async function registerSubscriptionProducts(accessToken: string): Promise<void> {
  const axios = getAxios(accessToken);

  for (const product of subscriptionProducts) {
    try {
      await axios.post('/seller/products', product);
    } catch (error) {
      console.error('구독권 등록 실패:', error);
    }
  }
}

export interface LoginState {
  ok: 0 | 1;
  message?: string;
  errors?: {
    email?: { msg: string };
    password?: { msg: string };
  };
  item?: {
    _id: number;
    email: string;
    name: string;
    type?: string;
    loginType?: string;
    image?: string;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface SignupState {
  ok: 0 | 1;
  message?: string;
  errors?: {
    name?: { msg: string };
    email?: { msg: string };
    password?: { msg: string };
    phone?: { msg: string };
    address?: { msg: string };
    extra?: { msg: string };
  };
  values?: {
    type: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    detailAddress: string;
    introduction: string;
  };
  item?: {
    _id: number;
    email: string;
    name: string;
    type?: string;
    loginType?: string;
    image?: string;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export async function signup(
  prevState: SignupState | null,
  formData: FormData
): Promise<SignupState> {
  const type = formData.get('type') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phone = formData.get('phone') as string;
  const addressBase = formData.get('address') as string;
  const detailAddress = formData.get('detailAddress') as string;
  const address = detailAddress ? `${addressBase} ${detailAddress}` : addressBase;
  const introduction = formData.get('introduction') as string;
  const profileImageStr = formData.get('profileImage') as string;

  // 유효성 검사
  const errors: SignupState['errors'] = {};

  if (!name) {
    errors.name = { msg: '이름을 입력해주세요.' };
  }

  if (!email) {
    errors.email = { msg: '이메일을 입력해주세요.' };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = { msg: '올바른 이메일 형식이 아닙니다.' };
  }

  if (!password) {
    errors.password = { msg: '비밀번호를 입력해주세요.' };
  } else if (password.length < 8) {
    errors.password = { msg: '비밀번호는 8자 이상이어야 합니다.' };
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password)) {
    errors.password = { msg: '비밀번호는 영문과 숫자를 포함해야 합니다.' };
  }

  if (password !== confirmPassword) {
    errors.password = { msg: '비밀번호가 일치하지 않습니다.' };
  }

  if (!phone) {
    errors.phone = { msg: '전화번호를 입력해주세요.' };
  }

  if (!addressBase) {
    errors.address = { msg: '주소를 입력해주세요.' };
  } else if (!detailAddress) {
    errors.address = { msg: '상세주소를 입력해주세요.' };
  }

  if (type === 'seller' && (!introduction || introduction.length < 100)) {
    errors.extra = { msg: '자기소개를 100자 이상 입력해주세요.' };
  }

  const values = { type, name, email, phone, address: addressBase, detailAddress, introduction: introduction || '' };

  if (Object.keys(errors).length > 0) {
    return { ok: 0, message: '입력값을 확인해주세요.', errors, values };
  }

  try {
    let image: string | { path: string; name: string };
    if (profileImageStr) {
      try {
        image = JSON.parse(profileImageStr);
      } catch {
        image = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(email)}&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
      }
    } else {
      image = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(email)}&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    }

    const userData = {
      type,
      name,
      email,
      password,
      phone,
      address,
      image,
      ...(type === 'seller' && { extra: { introduction } }),
    };

    const response = await getAxios().post('/users', userData);
    const data = response.data;

    if (!data.ok) {
      return {
        ok: 0,
        message: data.message || '회원가입에 실패했습니다.',
        errors: data.errors,
        values,
      };
    }

    // 회원가입 성공 후 자동 로그인
    try {
      const loginResponse = await getAxios().post('/users/login', { email, password });
      const loginData = loginResponse.data;

      if (loginData.ok) {
        // 판매자인 경우 구독권 3종 자동 등록
        if (type === 'seller') {
          await registerSubscriptionProducts(loginData.item.token.accessToken);
        }

        return {
          ok: 1,
          message: '회원가입 성공',
          item: {
            _id: loginData.item._id,
            email: loginData.item.email,
            name: loginData.item.name,
            type: loginData.item.type,
            loginType: loginData.item.loginType,
            image: loginData.item.image,
            token: {
              accessToken: loginData.item.token.accessToken,
              refreshToken: loginData.item.token.refreshToken,
            },
          },
        };
      }
    } catch {
      // 자동 로그인 실패 시 회원가입 성공만 반환
    }

    return {
      ok: 1,
      message: '회원가입 성공',
    };
  } catch (error: unknown) {
    console.error('회원가입 에러:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string; errors?: SignupState['errors'] } } };
      const data = axiosError.response.data;
      return {
        ok: 0,
        message: data.message || '회원가입에 실패했습니다.',
        errors: data.errors,
        values,
      };
    }
    return {
      ok: 0,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      values,
    };
  }
}

export async function login(
  prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 유효성 검사
  const errors: LoginState['errors'] = {};

  if (!email) {
    errors.email = { msg: '이메일을 입력해주세요.' };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = { msg: '올바른 이메일 형식이 아닙니다.' };
  }

  if (!password) {
    errors.password = { msg: '비밀번호를 입력해주세요.' };
  } else if (password.length < 8) {
    errors.password = { msg: '비밀번호는 8자 이상이어야 합니다.' };
  }

  if (Object.keys(errors).length > 0) {
    return { ok: 0, message: '입력값을 확인해주세요.', errors };
  }

  try {
    const response = await getAxios().post('/users/login', { email, password });
    const data = response.data;

    if (!data.ok) {
      return {
        ok: 0,
        message: data.message || '이메일 또는 비밀번호가 일치하지 않습니다.',
        errors: data.errors,
      };
    }

    return {
      ok: 1,
      message: '로그인 성공',
      item: {
        _id: data.item._id,
        email: data.item.email,
        name: data.item.name,
        type: data.item.type,
        loginType: data.item.loginType,
        image: data.item.image,
        token: {
          accessToken: data.item.token.accessToken,
          refreshToken: data.item.token.refreshToken,
        },
      },
    };
  } catch (error: unknown) {
    console.error('로그인 에러:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string; errors?: LoginState['errors'] } } };
      const data = axiosError.response.data;
      return {
        ok: 0,
        message: data.message || '이메일 또는 비밀번호가 일치하지 않습니다.',
        errors: data.errors,
      };
    }
    return {
      ok: 0,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
