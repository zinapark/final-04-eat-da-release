import { getAxios } from "@/lib/axios";

const API_SERVER = process.env.NEXT_PUBLIC_API_URL;

// 사용자 주문 내역 조회 (구매완료 상태만 필터)
export async function fetchOrders() {
  const axios = getAxios();
  const res = await axios.get("/orders");
  return res.data.item || [];
}

// 내가 작성한 리뷰 목록 조회
export async function fetchMyReviews() {
  const axios = getAxios();
  const res = await axios.get("/replies");
  return res.data.item || [];
}

// 리뷰 단건 조회
export async function fetchReview(replyId: number) {
  const axios = getAxios();
  const res = await axios.get(`/replies/${replyId}`);
  return res.data.item;
}

// 상품 정보 조회
export async function fetchProduct(productId: number) {
  const axios = getAxios();
  const res = await axios.get(`/products/${productId}`);
  return res.data.item;
}

// 리뷰 작성
export async function createReview(data: {
  order_id: number;
  product_id: number;
  rating: number;
  content: string;
  extra?: { images?: { path: string; name: string }[] };
}) {
  const axios = getAxios();
  const res = await axios.post("/replies", data);
  return res.data;
}

// 리뷰 수정
export async function updateReview(
  replyId: number,
  data: {
    rating?: number;
    content?: string;
    extra?: { images?: { path: string; name: string }[] };
  },
) {
  const axios = getAxios();
  const res = await axios.patch(`/replies/${replyId}`, data);
  return res.data;
}

// 리뷰 삭제
export async function deleteReview(replyId: number) {
  const axios = getAxios();
  const res = await axios.delete(`/replies/${replyId}`);
  return res.data;
}

// 리뷰 이미지 업로드
export async function uploadReviewImages(
  files: File[],
): Promise<{ path: string; name: string }[]> {
  if (files.length === 0) return [];

  const axios = getAxios();
  const uploadedImages: { path: string; name: string }[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("attach", file);

    const response = await axios.post("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.ok && response.data.item[0]) {
      uploadedImages.push({
        path: response.data.item[0].path,
        name: response.data.item[0].name,
      });
    }
  }

  return uploadedImages;
}

// 이미지 경로에 API 서버 URL 붙이기
export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_SERVER}${path}`;
}
