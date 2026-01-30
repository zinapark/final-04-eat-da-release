// 반찬 폼 데이터 (등록/수정 공통)
export interface BanchanFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  ingredients: string;
  servings: string;
  quantity: string;
  pickupPlace: string;
}

// 반찬 등록/수정 API 데이터
export interface BanchanData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  ingredients: string;
  servings: string;
  pickupPlace: string;
  mainImages: { path: string; name: string }[];
  id?: number;
  show?: boolean;
}

// 반찬 아이템 (서버 응답)
export interface BanchanItem {
  _id: number;
  seller_id: number;
  price: number;
  show: boolean;
  active: boolean;
  name: string;
  quantity: number;
  buyQuantity: number;
  mainImages: {
    path: string;
    name: string;
  }[];
  content: string;
  createdAt: string;
  updatedAt: string;
  extra: {
    description: string;
    ingredients: string;
    servings: string;
    pickupPlace: string;
  };
  seller: {
    _id: number;
    email: string;
    name: string;
    phone: string;
    address: string;
    type: string;
  };
  bookmarks: number;
  rating: number;
}

export interface BanchanResponse {
  ok: number;
  item: BanchanItem;
}

export interface BanchanListResponse {
  ok: number;
  items: BanchanItem[];
}

// 수정 페이지 props
export interface EditBanchanClientProps {
  initialData: {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    ingredients: string;
    servings: string;
    quantity: string;
    pickupPlace: string;
    images: string[];
    show: boolean;
  };
}
