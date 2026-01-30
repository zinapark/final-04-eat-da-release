import axios from "axios";

const API_SERVER = process.env.NEXT_PUBLIC_API_URL;

// 개발용 임시 토큰 (나중에 로그인 기능 구현 후 제거)
const TEMP_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEyLCJ0eXBlIjoic2VsbGVyIiwiaWF0IjoxNzY5NTc0MTQzLCJleHAiOjE3Njk2NjA1NDMsImlzcyI6IkZFQkMifQ.UofwpK0U914IXxQcIXYGW5C2Jh8OvDYfgf4QYz3Ywr4";

// 토큰 가져오기 / 나중에 로그인 구현되면 수정할것
export function getAccessToken(): string | null {
  return TEMP_ACCESS_TOKEN;
}

// 토큰에서 유저 정보 추출
export function getTokenPayload(): { _id: number; type: string } | null {
  const token = TEMP_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function getAxios() {
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

      // 토큰 설정
      const token = getAccessToken();
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
      return Promise.reject(new Error("잠시 후 다시 이용해 주시기 바랍니다."));
    },
  );

  return instance;
}
