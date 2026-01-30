import { getAxios } from "@/lib/axios";

interface CartItem {
  _id: number;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    mainImages: { path: string; name: string }[];
  };
}

interface UserInfo {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  type: "user" | "seller";
  image: string;
  bookmark: {
    products: number;
    users: number;
    posts: number;
  };
}

// 장바구니 목록 조회
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const axios = getAxios();
    const response = await axios.get("/carts");
    if (response.data.ok) {
      return response.data.item;
    }
    return [];
  } catch (error) {
    console.error("장바구니 조회 실패:", error);
    return [];
  }
}

// 유저 정보 조회
export async function getUser(userId: number): Promise<UserInfo | null> {
  try {
    const axios = getAxios();
    const response = await axios.get(`/users/${userId}`);
    if (response.data.ok) {
      return response.data.item;
    }
    return null;
  } catch (error) {
    console.error("유저 정보 조회 실패:", error);
    return null;
  }
}

// 찜 목록 개수 조회
export async function getBookmarkCount(): Promise<number> {
  try {
    const axios = getAxios();
    const response = await axios.get("/bookmarks/product");
    if (response.data.ok) {
      return response.data.item.length;
    }
    return 0;
  } catch (error) {
    console.error("찜 목록 조회 실패:", error);
    return 0;
  }
}

