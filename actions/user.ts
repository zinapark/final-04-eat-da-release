'use server';

import { getAxios } from '@/lib/axios';

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
  } catch (error) {
    console.error('로그인 에러:', error);
    return {
      ok: 0,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
