/**
 * 소켓 연결 관리 모듈
 * - 싱글톤 패턴으로 소켓 인스턴스를 관리
 * - 앱 전체에서 하나의 소켓 연결만 유지
 */

import { io, Socket } from 'socket.io-client';

// 환경 변수에서 API URL과 클라이언트 ID 가져오기
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

// WebSocket 연결 URL 생성 (/market 제거 후 /ws/{clientId} 추가)
const WS_URL = API_URL?.replace('/market', '') + `/ws/${CLIENT_ID}`;

// 싱글톤 소켓 인스턴스
let socket: Socket | null = null;

/**
 * 소켓 인스턴스를 반환하는 함수
 * - 이미 연결된 소켓이 있으면 재사용
 * - 없으면 새로 생성
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL);
  }
  return socket;
}
