// 반찬 데이터 타입
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
    pickupLocation: string;
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

// 임시 데이터
export const banchanList: BanchanListResponse = {
  ok: 1,
  items: [
    {
      _id: 1,
      seller_id: 3,
      price: 6800,
      show: true,
      active: true,
      name: "불고기",
      quantity: 1,
      buyQuantity: 0,
      mainImages: [
        {
          path: "",
          name: "food1.png",
        },
      ],
      content: "달콤한 양념의 불고기",
      createdAt: "2026.01.20 10:00:00",
      updatedAt: "2026.01.21 10:00:00",
      extra: {
        description: "달콤한 양념의 불고기",
        ingredients: "소고기, 양파, 대파, 간장, 설탕, 참기름",
        servings: "2",
        pickupLocation: "상수동 공유주방",
      },
      seller: {
        _id: 3,
        email: "jubu@gmail.com",
        name: "박주부",
        phone: "01012345678",
        address: "상수동",
        type: "seller",
      },
      bookmarks: 5,
      rating: 4.8,
    },
    {
      _id: 2,
      seller_id: 3,
      price: 12000,
      show: true,
      active: true,
      name: "치킨",
      quantity: 6,
      buyQuantity: 0,
      mainImages: [
        {
          path: "/food1.png",
          name: "food1.png",
        },
      ],
      content: "매콤달콤 제육볶음",
      createdAt: "2026.01.20 14:30:00",
      updatedAt: "2026.01.21 09:00:00",
      extra: {
        description: "매콤달콤 제육볶음",
        ingredients: "돼지고기, 양파, 대파, 고추장, 고춧가루, 간장",
        servings: "3",
        pickupLocation: "서교동 공유주방",
      },
      seller: {
        _id: 3,
        email: "jubu@gmail.com",
        name: "김주부",
        phone: "01012345678",
        address: "서교동",
        type: "seller",
      },
      bookmarks: 12,
      rating: 4.9,
    },
    {
      _id: 3,
      seller_id: 3,
      price: 8000,
      show: true,
      active: true,
      name: "파김치",
      quantity: 1,
      buyQuantity: 0,
      mainImages: [
        {
          path: "/food1.png",
          name: "food1.png",
        },
      ],
      content: "아삭한 파김치",
      createdAt: "2026.01.18 11:00:00",
      updatedAt: "2026.01.20 15:00:00",
      extra: {
        description: "아삭한 파김치",
        ingredients: "쪽파, 고춧가루, 멸치액젓, 새우젓, 마늘",
        servings: "4",
        pickupLocation: "망원동 공유주방",
      },
      seller: {
        _id: 3,
        email: "jubu@gmail.com",
        name: "이주부",
        phone: "01012345678",
        address: "망원동",
        type: "seller",
      },
      bookmarks: 3,
      rating: 4.5,
    },
    {
      _id: 4,
      seller_id: 3,
      price: 12000,
      show: false,
      active: false,
      name: "장조림",
      quantity: 0,
      buyQuantity: 0,
      mainImages: [
        {
          path: "/food1.png",
          name: "food1.png",
        },
      ],
      content: "짭짤한 장조림",
      createdAt: "2026.01.15 09:00:00",
      updatedAt: "2026.01.19 12:00:00",
      extra: {
        description: "짭짤한 장조림",
        ingredients: "소고기, 간장, 마늘, 꽈리고추, 메추리알",
        servings: "2",
        pickupLocation: "연남동 공유주방",
      },
      seller: {
        _id: 3,
        email: "jubu@gmail.com",
        name: "정주부",
        phone: "01012345678",
        address: "연남동",
        type: "seller",
      },
      bookmarks: 8,
      rating: 4.7,
    },
  ],
};
