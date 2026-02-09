import axios from "axios";

const API_SERVER = process.env.NEXT_PUBLIC_API_URL;

// zustand localStorage에서 토큰 가져오기
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = localStorage.getItem("user-storage");
    if (!storage) return null;
    const { state } = JSON.parse(storage);
    return state?.user?.token?.accessToken || null;
  } catch {
    return null;
  }
}

// zustand localStorage에서 유저 정보 추출
export function getTokenPayload(): { _id: number; type: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = localStorage.getItem("user-storage");
    if (!storage) return null;
    const { state } = JSON.parse(storage);
    if (!state?.user) return null;
    return { _id: state.user._id, type: state.user.type };
  } catch {
    return null;
  }
}

export function getAxios(accessToken?: string) {
  const instance = axios.create({
    baseURL: API_SERVER,
    timeout: 1000 * 10,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      console.log("요청 인터셉터 호출", config);

      // 직접 전달된 토큰 우선 사용, 없으면 localStorage에서 가져오기
      const token = accessToken || getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.params = {
        ...config.params,
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      console.log("정상 응답 인터셉터 호출", response);
      if (response.data.ok !== undefined) {
        response.data.ok = !!response.data.ok;
      }
      return response;
    },
    (error) => {
      console.error("에러 응답 인터셉터 호출", error);
      // API가 에러 응답 데이터를 보낸 경우 그대로 전달
      if (error.response?.data) {
        return Promise.reject(error);
      }
      return Promise.reject(new Error("잠시 후 다시 이용해 주시기 바랍니다."));
    },
  );

  return instance;
}
