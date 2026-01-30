function formatKST(date = new Date()) {
  // "2026.1.27 11:46:37" 형식 맞추기
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}.${m}.${d} ${hh}:${mm}:${ss}`;
}

// ✅ 주부(판매자) 10명
const sellers = [
  {
    _id: 1,
    seller_id: 1,
    name: '김미숙',
    email: 'misook@eatda.com',
    password: 'eatda1234',
    phone: '01011111111',
    address: '서울시 마포구 서교동 123',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=misook&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '30년 주부 경력으로 정성스럽게 만든 집밥을 나눕니다. 아들 둘을 키우며 매일 해온 손맛 그대로 담았어요.',
    },
  },
  {
    _id: 2,
    seller_id: 2,
    name: '양정희',
    email: 'junghee@eatda.com',
    password: 'eatda1234',
    phone: '01022222222',
    address: '서울시 강남구 역삼동 456',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=jungh&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '어머니께 배운 전통 레시피로 건강한 밥상을 차립니다. 조미료 없이 자연 재료로만 맛을 내요.',
    },
  },
  {
    _id: 3,
    seller_id: 3,
    name: '이선영',
    email: 'sunyoung@eatda.com',
    password: 'eatda1234',
    phone: '01033333333',
    address: '서울시 송파구 잠실동 789',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=sunyoung&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '요리학원 강사 출신입니다. 맛있고 예쁜 반찬으로 식탁에 행복을 더해드릴게요.',
    },
  },
  {
    _id: 4,
    seller_id: 4,
    name: '최은지',
    email: 'eunji@eatda.com',
    password: 'eatda1234',
    phone: '01044444444',
    address: '서울시 서초구 반포동 101',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=eunji&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '세 아이 엄마로 아이들 입맛에 맞는 건강 반찬을 연구합니다. 편식하는 아이도 맛있게 먹어요.',
    },
  },
  {
    _id: 5,
    seller_id: 5,
    name: '정하늘',
    email: 'haneul@eatda.com',
    password: 'eatda1234',
    phone: '01055555555',
    address: '서울시 용산구 이태원동 202',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=skyhanlllllllllllllllllllll&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '매일 새벽 시장에서 신선한 재료를 직접 골라요. 좋은 재료가 맛있는 음식의 비결입니다.',
    },
  },
  {
    _id: 6,
    seller_id: 6,
    name: '강민수',
    email: 'minsu@eatda.com',
    password: 'eatda1234',
    phone: '01066666666',
    address: '서울시 종로구 삼청동 303',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=minsusedc&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '호텔 조리사 출신으로 은퇴 후 집밥의 따뜻함을 전하고 있어요. 정갈한 한 끼를 약속드립니다.',
    },
  },
  {
    _id: 7,
    seller_id: 7,
    name: '오준호',
    email: 'junho@eatda.com',
    password: 'eatda1234',
    phone: '01077777777',
    address: '서울시 성동구 성수동 404',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Brian&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '1인 가구를 위한 소포장 반찬을 준비합니다. 혼밥도 든든하고 맛있게 드세요.',
    },
  },
  {
    _id: 8,
    seller_id: 8,
    name: '한도윤',
    email: 'doyun@eatda.com',
    password: 'eatda1234',
    phone: '01088888888',
    address: '서울시 광진구 건대입구동 505',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '건강을 생각하는 저염식 반찬을 만듭니다. 맛은 유지하면서 나트륨은 줄였어요.',
    },
  },
  {
    _id: 9,
    seller_id: 9,
    name: '윤재현',
    email: 'jaehyun@eatda.com',
    password: 'eatda1234',
    phone: '01099999999',
    address: '서울시 영등포구 여의도동 606',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=jaehyun&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '직장인 도시락 전문입니다. 바쁜 하루, 따뜻한 집밥 한 끼로 힘내세요.',
    },
  },
  {
    _id: 10,
    seller_id: 10,
    name: '문정미',
    email: 'jihoon@eatda.com',
    password: 'eatda1234',
    phone: '01010101010',
    address: '서울시 중구 명동 707',
    type: 'seller',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=jungmiaalk&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    extra: {
      description:
        '할머니 손맛을 이어받아 옛날 방식 그대로 반찬을 만들어요. 추억의 맛을 느껴보세요.',
    },
  },
];

// ✅ 구매자(유저) 10명
const users = [
  {
    _id: 21,
    email: 'user1@test.com',
    password: 'test1234',
    name: '박지민',
    phone: '01012340001',
    address: '서울시 강남구 논현동 11',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 22,
    email: 'user2@test.com',
    password: 'test1234',
    name: '김수현',
    phone: '01012340002',
    address: '서울시 서초구 서초동 22',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 23,
    email: 'user3@test.com',
    password: 'test1234',
    name: '이하늘',
    phone: '01012340003',
    address: '서울시 마포구 합정동 33',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Eliza&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 24,
    email: 'user4@test.com',
    password: 'test1234',
    name: '정우진',
    phone: '01012340004',
    address: '서울시 송파구 방이동 44',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Valentina&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 25,
    email: 'user5@test.com',
    password: 'test1234',
    name: '최서연',
    phone: '01012340005',
    address: '서울시 영등포구 당산동 55',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Valentina&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 26,
    email: 'user6@test.com',
    password: 'test1234',
    name: '강민호',
    phone: '01012340006',
    address: '서울시 용산구 한남동 66',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Valentina&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 27,
    email: 'user7@test.com',
    password: 'test1234',
    name: '윤채원',
    phone: '01012340007',
    address: '서울시 성동구 왕십리동 77',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=sunyoung&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 28,
    email: 'user8@test.com',
    password: 'test1234',
    name: '한도현',
    phone: '01012340008',
    address: '서울시 광진구 자양동 88',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=Nolan&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 29,
    email: 'user9@test.com',
    password: 'test1234',
    name: '오예린',
    phone: '01012340009',
    address: '서울시 종로구 평창동 99',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=yer&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
  {
    _id: 30,
    email: 'user10@test.com',
    password: 'test1234',
    name: '문준서',
    phone: '01012340010',
    address: '서울시 중구 을지로동 100',
    type: 'user',
    image:
      'https://api.dicebear.com/9.x/avataaars/svg?seed=%EB%AC%B8%EC%A4%80%EC%84%9C&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  },
];

// ✅ 카테고리
const categories = [
  {
    key: 'main',
    label: '메인반찬',
    items: [
      '제육볶음',
      '닭갈비',
      '돈까스',
      '떡갈비',
      '불고기',
      '고등어구이',
      '삼겹김치볶음',
      'LA갈비',
      '훈제오리볶음',
      '보쌈',
    ],
  },
  {
    key: 'soup',
    label: '국물',
    items: [
      '김치찌개',
      '된장찌개',
      '순두부찌개',
      '미역국',
      '떡국',
      '육개장',
      '콩나물국',
      '감자탕',
      '갈비탕',
      '북엇국',
    ],
  },
  {
    key: 'side',
    label: '밑반찬',
    items: [
      '오이무침',
      '콩자반',
      '무생채',
      '시금치나물',
      '도라지무침',
      '멸치볶음',
      '계란말이',
      '진미채무침',
      '감자샐러드',
      '고사리나물',
    ],
  },
  {
    key: 'stir',
    label: '볶음',
    items: [
      '소시지야채볶음',
      '새우볶음',
      '오징어볶음',
      '김치볶음',
      '버섯볶음',
      '어묵볶음',
      '두부김치',
      '가지볶음',
      '닭똥집볶음',
      '주꾸미볶음',
    ],
  },
  {
    key: 'braise',
    label: '조림',
    items: [
      '장조림',
      '감자조림',
      '꽁치김치조림',
      '두부조림',
      '코다리조림',
      '메추리알장조림',
      '갈치조림',
      '연근조림',
      '무조림',
      '우엉조림',
    ],
  },
  {
    key: 'steam',
    label: '찜',
    items: [
      '계란찜',
      '갈비찜',
      '닭찜',
      '등갈비찜',
      '아구찜',
      '콩나물찜',
      '해물찜',
      '단호박찜',
      '만두찜',
      '수육찜',
    ],
  },
  {
    key: 'fry',
    label: '튀김',
    items: [
      '새우튀김',
      '김말이튀김',
      '고구마튀김',
      '오징어튀김',
      '야채튀김',
      '만두튀김',
      '닭강정',
      '돈가스',
      '치킨가라아게',
      '고추튀김',
    ],
  },
];

const defaultPickupPlace = '서교동 공유주방';
const defaultServing = '2인분';

// 요리명 → 재료 매핑
const ingredientsByName = {
  // =========================
  // 메인반찬(main)
  // =========================
  제육볶음: ['돼지고기', '고추장', '양파', '대파', '마늘'],
  닭갈비: ['닭고기', '고추장', '양배추', '고구마', '떡'],
  돈까스: ['돼지고기', '빵가루', '계란', '밀가루', '돈까스소스'],
  떡갈비: ['다진소고기', '다진돼지고기', '양파', '간장', '마늘'],
  불고기: ['소고기', '간장', '양파', '대파', '배즙'],
  고등어구이: ['고등어', '소금', '레몬', '후추', '식용유'],
  삼겹김치볶음: ['삼겹살', '김치', '양파', '대파', '고춧가루'],
  LA갈비: ['LA갈비', '간장', '양파', '마늘', '배즙'],
  훈제오리볶음: ['훈제오리', '양배추', '부추', '양파', '간장'],
  보쌈: ['돼지고기', '된장', '마늘', '생강', '새우젓'],

  // =========================
  // 국물(soup)
  // =========================
  김치찌개: ['돼지고기', '김치', '두부', '대파', '고춧가루'],
  된장찌개: ['된장', '애호박', '두부', '양파', '대파'],
  순두부찌개: ['순두부', '계란', '양파', '대파', '고춧가루'],
  미역국: ['미역', '소고기', '국간장', '마늘', '참기름'],
  떡국: ['가래떡', '사골육수', '대파', '계란', '김가루'],
  육개장: ['소고기', '고사리', '대파', '고춧가루', '숙주'],
  콩나물국: ['콩나물', '대파', '마늘', '국간장', '고춧가루'],
  감자탕: ['등뼈', '감자', '시래기', '들깨가루', '대파'],
  갈비탕: ['소갈비', '무', '대파', '마늘', '후추'],
  북엇국: ['북어', '무', '대파', '마늘', '계란'],

  // =========================
  // 밑반찬(side)
  // =========================
  오이무침: ['오이', '고춧가루', '식초', '마늘', '참기름'],
  콩자반: ['검은콩', '간장', '올리고당', '마늘', '참기름'],
  무생채: ['무', '고춧가루', '식초', '마늘', '대파'],
  시금치나물: ['시금치', '마늘', '참기름', '소금', '깨'],
  도라지무침: ['도라지', '고춧가루', '식초', '마늘', '설탕'],
  멸치볶음: ['멸치', '간장', '마늘', '설탕', '견과류'],
  계란말이: ['계란', '당근', '대파', '소금', '식용유'],
  진미채무침: ['진미채', '고추장', '마요네즈', '마늘', '올리고당'],
  감자샐러드: ['감자', '마요네즈', '오이', '당근', '햄'],
  고사리나물: ['고사리', '간장', '마늘', '대파', '참기름'],

  // =========================
  // 볶음(stir)
  // =========================
  소시지야채볶음: ['소시지', '양파', '피망', '케첩', '마늘'],
  새우볶음: ['새우', '마늘', '버터', '파슬리', '소금'],
  오징어볶음: ['오징어', '고추장', '양파', '대파', '마늘'],
  김치볶음: ['김치', '양파', '대파', '고춧가루', '참기름'],
  버섯볶음: ['버섯', '양파', '대파', '간장', '마늘'],
  어묵볶음: ['어묵', '양파', '간장', '대파', '마늘'],
  두부김치: ['두부', '김치', '대파', '양파', '고춧가루'],
  가지볶음: ['가지', '간장', '마늘', '대파', '참기름'],
  닭똥집볶음: ['닭똥집', '마늘', '대파', '간장', '후추'],
  주꾸미볶음: ['주꾸미', '고추장', '양파', '대파', '마늘'],

  // =========================
  // 조림(braise)
  // =========================
  장조림: ['소고기', '간장', '마늘', '꽈리고추', '메추리알'],
  감자조림: ['감자', '간장', '양파', '올리고당', '대파'],
  꽁치김치조림: ['꽁치', '김치', '대파', '고춧가루', '마늘'],
  두부조림: ['두부', '간장', '고춧가루', '대파', '마늘'],
  코다리조림: ['코다리', '무', '고춧가루', '대파', '마늘'],
  메추리알장조림: ['메추리알', '간장', '마늘', '꽈리고추', '양파'],
  갈치조림: ['갈치', '무', '고춧가루', '대파', '마늘'],
  연근조림: ['연근', '간장', '올리고당', '식초', '참기름'],
  무조림: ['무', '간장', '고춧가루', '대파', '마늘'],
  우엉조림: ['우엉', '간장', '올리고당', '식초', '깨'],

  // =========================
  // 찜(steam)
  // =========================
  계란찜: ['계란', '물', '소금', '대파', '새우젓'],
  갈비찜: ['소갈비', '간장', '당근', '무', '마늘'],
  닭찜: ['닭고기', '간장', '감자', '당근', '대파'],
  등갈비찜: ['등갈비', '간장', '마늘', '양파', '당근'],
  아구찜: ['아구', '콩나물', '고춧가루', '대파', '마늘'],
  콩나물찜: ['콩나물', '고춧가루', '대파', '마늘', '간장'],
  해물찜: ['오징어', '새우', '홍합', '고춧가루', '대파'],
  단호박찜: ['단호박', '꿀', '견과류', '우유', '소금'],
  만두찜: ['만두', '양배추', '대파', '간장', '식초'],
  수육찜: ['돼지고기', '된장', '마늘', '생강', '양파'],

  // =========================
  // 튀김(fry)
  // =========================
  새우튀김: ['새우', '튀김가루', '계란', '빵가루', '식용유'],
  김말이튀김: ['김말이', '튀김가루', '계란', '빵가루', '식용유'],
  고구마튀김: ['고구마', '튀김가루', '계란', '식용유', '소금'],
  오징어튀김: ['오징어', '튀김가루', '계란', '빵가루', '식용유'],
  야채튀김: ['당근', '양파', '깻잎', '튀김가루', '식용유'],
  만두튀김: ['만두', '식용유', '간장', '식초', '고춧가루'],
  닭강정: ['닭고기', '튀김가루', '간장', '올리고당', '마늘'],
  돈가스: ['돼지고기', '빵가루', '계란', '밀가루', '돈까스소스'],
  치킨가라아게: ['닭고기', '간장', '마늘', '전분', '식용유'],
  고추튀김: ['고추', '돼지고기', '당면', '튀김가루', '식용유'],
};

// 매핑이 없는 음식은 카테고리별 기본 재료로 채움
const fallbackIngredientsByCategory = {
  main: ['고기', '양파', '대파', '마늘'],
  soup: ['육수', '두부', '대파', '양파'],
  side: ['채소', '양념', '참기름'],
  stir: ['재료', '양파', '대파', '양념'],
  braise: ['주재료', '간장', '마늘', '양파'],
  steam: ['주재료', '대파', '소금'],
  fry: ['주재료', '튀김가루', '식용유'],
};

// ✅ 요리명 → 이미지 URL 매핑
const imagesByName = {
  // =========================
  // 메인반찬 (main)
  // =========================
  제육볶음:
    'https://zipbanchan.godohosting.com/800X800px/3_main/1339_ZIP_P_0088_T.jpg',
  닭갈비: '/food/ChickenGalbi.jpg',
  돈까스: '/food/DontGas.jpg',
  떡갈비:
    'https://zipbanchan.godohosting.com/800X800px/3_main/1688_ZIP_P_3142_T.jpg',
  불고기:
    'https://zipbanchan.godohosting.com/800X800px/3_main/1349_ZIP_P_0094_T.jpg',
  고등어구이: '/food/koduengA.jpg',
  삼겹김치볶음: '/food/PorkKimchi.jpg',
  LA갈비: '/food/LA.jpg',
  훈제오리볶음: '/food/Duck.jpg',
  보쌈: '/food/Bossam.webp',

  // =========================
  // 국물 (soup)
  // =========================
  김치찌개:
    'https://zipbanchan.godohosting.com/800X800px/9_soup/1364_ZIP_P_1043_T.jpg',
  된장찌개:
    'https://zipbanchan.godohosting.com/800X800px/9_soup/1362_ZIP_P_1041_T.jpg',
  순두부찌개:
    'https://zipbanchan.godohosting.com/800X800px/9_soup/ZIP_P_1077_T_3.png',
  미역국:
    'https://zipbanchan.godohosting.com/800X800px/9_soup/172_ZIP_P_2008_T_1.jpg',
  떡국: '/food/TeokKuk.jpg',
  육개장: '/food/6GaeJang.jpg',
  콩나물국:
    'https://zipbanchan.godohosting.com/800X800px/9_soup/175_ZIP_P_2005_T.jpg',
  감자탕: '/food/GamZa.jpg',
  갈비탕: '/food/GalbiTang.jpg',
  북엇국: '/food/Bookeo.jpg',

  // =========================
  // 밑반찬 (side)
  // =========================
  오이무침: '/food/muchim.jpg',
  콩자반:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/1195_ZIP_P_4062_T.jpg',
  무생채: '/food/Moomuchim.jpg',
  시금치나물: '/food/ShiGumchi.jpg',
  도라지무침:
    'https://zipbanchan.godohosting.com/800X800px/8_muchim/129_ZIP_P_5010_T.jpg',
  멸치볶음:
    'https://zipbanchan.godohosting.com/800X800px/7_fry/1200_ZIP_P_6219_T.jpg',
  계란말이:
    'https://zipbanchan.godohosting.com/800X800px/5_kid/345_ZIP_P_3022_T.jpg',
  진미채무침: '/food/Jinmichae.jpeg',
  감자샐러드: '/food/potatoSalad.jpg',
  고사리나물:
    'https://zipbanchan.godohosting.com/800X800px/7_fry/1190_ZIP_P_6208_T.jpg',

  // =========================
  // 볶음 (stir)
  // =========================
  소시지야채볶음:
    'https://zipbanchan.godohosting.com//800X800px/7_fry/2361_ZIP_P_6233_T_2.jpg',
  새우볶음:
    'https://zipbanchan.godohosting.com/800X800px/7_fry/160_ZIP_P_6030_T_re.jpg',
  오징어볶음:
    'https://zipbanchan.godohosting.com/800X800px/8_muchim/48_ZIP_P_5008_T.jpg',
  김치볶음:
    'https://zipbanchan.godohosting.com/800X800px/7_fry/1207_ZIP_P_6222_T.jpg',
  버섯볶음:
    'https://zipbanchan.godohosting.com/800X800px/5_kid/1731_ZIP_P_6292_T.jpg',
  어묵볶음:
    'https://zipbanchan.godohosting.com//800X800px/7_fry/2359_ZIP_P_6431_T_2.png',
  두부김치: '/food/TofuKimchi.jpg',
  가지볶음:
    'https://zipbanchan.godohosting.com/800X800px/7_fry/1692_ZIP_P_6291_T.jpg',
  닭똥집볶음: '/food/Dakddongzip.jpg',
  주꾸미볶음: '/food/jukkumi.jpg',

  // =========================
  // 조림 (braise)
  // =========================
  장조림:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/32_ZIP_P_4002_T.jpg',
  감자조림:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/208_ZIP_P_4020_T_1.jpg',
  꽁치김치조림: '/food/kkongchi.jpg',
  두부조림:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/268_ZIP_P_4023_T.jpg',
  코다리조림: '/food/kodari.jpg',
  메추리알장조림:
    'https://zipbanchan.godohosting.com/800X800px/low_sugar/2442_ZIP_P_4111_T_2.jpg',
  갈치조림: '/food/kalchi.jpg',
  연근조림:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/52_ZIP_P_4007_T.jpg',
  무조림:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/1613_ZIP_P_4075_T.jpg',
  우엉조림:
    'https://zipbanchan.godohosting.com/800X800px/6_jolim/56_ZIP_P_4009_T.jpg',

  // =========================
  // 찜 (steam)
  // =========================
  계란찜:
    'https://zipbanchan.godohosting.com/800X800px/5_kid/717_ZIP_P_3055_T.jpg',
  갈비찜: '/food/GalbiZzim.jpg',
  닭찜: '/food/ChickenZzim.jpg',
  등갈비찜: '/food/DeungGalbiZzim.jpg',
  아구찜:
    'https://thingool123.godohosting.com/data/goods/21/02/08/1000019180/1000019180_detail_091.jpg',
  콩나물찜: '/food/KongZZim.jpg',
  해물찜: '/food/SeafoodZZim.jpg',
  단호박찜: '/food/PumpkinZZim.jpg',
  만두찜: '/food/Mandu.jpg',
  수육찜: '/food/Su6.jpg',

  // =========================
  // 튀김 (fry)
  // =========================
  새우튀김: '/food/ShrimpFry.jpg',
  김말이튀김: '/food/GimMalee.jpeg',
  고구마튀김: '/food/sweetPotato.jpg',
  오징어튀김: '/food/SquidFry.jpeg',
  야채튀김: '/food/VegFry.jpg',
  만두튀김: '/food/ManduFry.jpg',
  닭강정: '/food/ChiGang.jpg',
  돈가스: '/food/PorkFry.png',
  치킨가라아게: '/food/garage.jpg',
  고추튀김: '/food/PepperFry.jpg',
};

const contentByName = {
  // =========================
  // 메인반찬 (main)
  // =========================
  제육볶음:
    '돼지고기를 고추장 양념에 재워 양파와 대파를 듬뿍 넣고 매콤달콤하게 볶았습니다.',
  닭갈비:
    '닭고기와 양배추, 고구마, 떡을 고추장 양념에 버무려 감칠맛 나게 볶아낸 춘천식 닭갈비입니다.',
  돈까스:
    '바삭한 빵가루 옷을 입힌 돼지고기를 노릇하게 튀겨, 달콤한 돈까스소스와 잘 어울립니다.',
  떡갈비:
    '다진 소고기와 돼지고기에 양파와 마늘을 더해 부드럽게 빚어 구운 떡갈비입니다.',
  불고기:
    '소고기를 간장 양념과 배즙으로 달콤하게 재워, 양파와 대파 향을 살려 볶아냈습니다.',
  고등어구이:
    '소금으로 간한 고등어를 겉은 바삭, 속은 촉촉하게 구워 레몬 한 방울로 깔끔하게 즐기세요.',
  삼겹김치볶음:
    '삼겹살과 잘 익은 김치를 양파, 대파와 함께 볶아 고소함과 칼칼함을 한 번에 담았습니다.',
  LA갈비:
    'LA갈비를 간장과 배즙 양념에 재워 부드럽게 구워낸 달콤짭짤한 갈비구이입니다.',
  훈제오리볶음:
    '훈제오리와 양배추, 부추를 간장 양념으로 불향 나게 볶아 담백한 풍미를 살렸습니다.',
  보쌈: '된장과 생강, 마늘로 삶아 잡내 없이 부드럽게 익힌 돼지고기를 새우젓과 함께 즐기세요.',

  // =========================
  // 국물 (soup)
  // =========================
  김치찌개:
    '돼지고기와 김치를 듬뿍 넣고 푹 끓여낸 칼칼한 국물에 두부가 부드럽게 어우러집니다.',
  된장찌개:
    '구수한 된장에 애호박, 두부, 양파를 넣어 집밥 느낌 그대로 끓여낸 기본 찌개입니다.',
  순두부찌개:
    '몽글한 순두부와 계란을 넣고 고춧가루로 칼칼하게 끓여 속을 따뜻하게 채워줍니다.',
  미역국:
    '미역을 참기름에 볶아 소고기와 함께 끓여낸 깊고 담백한 국물 맛이 특징입니다.',
  떡국: '사골육수에 가래떡을 부드럽게 끓이고 계란과 김가루로 고소함을 더한 든든한 떡국입니다.',
  육개장:
    '소고기와 고사리, 숙주를 고춧가루로 얼큰하게 끓여낸 진한 국물의 육개장입니다.',
  콩나물국:
    '아삭한 콩나물에 마늘과 대파를 더해 시원하게 끓인 해장 국물로 딱 좋습니다.',
  감자탕:
    '등뼈와 감자, 시래기를 넣고 들깨가루로 고소하게 마무리한 진한 감자탕입니다.',
  갈비탕:
    '소갈비를 푹 고아 맑고 깊은 국물에 무와 마늘로 깔끔하게 맛을 냈습니다.',
  북엇국:
    '북어와 무를 넣어 시원하게 끓이고 계란을 풀어 부드럽게 마무리한 속편한 국입니다.',

  // =========================
  // 밑반찬 (side)
  // =========================
  오이무침:
    '오이를 아삭하게 무쳐 고춧가루와 식초로 새콤매콤하게 맛을 살린 밑반찬입니다.',
  콩자반:
    '검은콩을 간장과 올리고당으로 달콤짭짤하게 조려, 한 숟갈씩 자꾸 손이 갑니다.',
  무생채:
    '무를 곱게 채 썰어 고춧가루와 식초로 상큼하게 무친, 입맛 돋우는 반찬입니다.',
  시금치나물:
    '데친 시금치를 마늘과 참기름으로 고소하게 무쳐 깔끔한 맛을 살렸습니다.',
  도라지무침:
    '도라지를 아삭하게 손질해 고춧가루와 식초로 새콤하게 무친 향긋한 나물입니다.',
  멸치볶음:
    '멸치를 간장 양념에 달달하게 볶고 견과류를 더해 고소한 식감을 살렸습니다.',
  계란말이:
    '계란에 당근과 대파를 더해 촉촉하게 말아낸, 아이부터 어른까지 좋아하는 반찬입니다.',
  진미채무침:
    '진미채를 고추장과 마요네즈로 부드럽게 무쳐 달콤매콤한 맛을 냈습니다.',
  감자샐러드:
    '포슬한 감자에 오이, 당근, 햄을 넣고 마요네즈로 부드럽게 버무렸습니다.',
  고사리나물:
    '고사리를 간장과 마늘로 볶아 은은한 향과 고소한 참기름 풍미를 더했습니다.',

  // =========================
  // 볶음 (stir)
  // =========================
  소시지야채볶음:
    '소시지와 양파, 피망을 케첩 양념에 볶아 새콤달콤한 맛이 살아있습니다.',
  새우볶음:
    '탱글한 새우를 마늘과 버터로 볶아 고소한 풍미를 살린 간단하지만 확실한 메뉴입니다.',
  오징어볶음:
    '오징어를 고추장 양념에 양파, 대파와 함께 볶아 쫄깃하고 매콤하게 즐길 수 있습니다.',
  김치볶음:
    '잘 익은 김치를 양파, 대파와 함께 볶아 감칠맛을 끌어올린 집밥 필수 반찬입니다.',
  버섯볶음:
    '버섯을 간장과 마늘로 빠르게 볶아 향과 식감을 살린 담백한 볶음반찬입니다.',
  어묵볶음:
    '어묵을 간장 양념에 달달하게 볶고 양파, 대파를 더해 부드럽게 즐길 수 있습니다.',
  두부김치:
    '담백한 두부와 볶은 김치를 곁들여, 고소함과 칼칼함의 조합을 담았습니다.',
  가지볶음:
    '가지를 간장과 마늘로 부드럽게 볶아 촉촉한 식감과 고소한 풍미가 살아있습니다.',
  닭똥집볶음:
    '닭똥집을 마늘과 대파로 볶아 쫄깃한 식감과 짭짤한 풍미를 살렸습니다.',
  주꾸미볶음:
    '주꾸미를 고추장 양념에 양파, 대파와 함께 볶아 매콤한 감칠맛이 확 올라옵니다.',

  // =========================
  // 조림 (braise)
  // =========================
  장조림:
    '소고기를 간장에 푹 졸이고 메추리알과 꽈리고추를 더해 짭짤한 밥도둑 장조림입니다.',
  감자조림:
    '감자를 간장과 올리고당 양념에 윤기 나게 졸여 달콤짭짤한 맛을 살렸습니다.',
  꽁치김치조림:
    '꽁치와 김치를 함께 조려 진한 감칠맛과 칼칼함이 어우러진 조림입니다.',
  두부조림:
    '두부에 간장 양념을 배게 조려, 촉촉하고 짭짤한 밥반찬으로 딱 좋습니다.',
  코다리조림:
    '코다리를 무와 함께 칼칼하게 조려, 살이 촉촉하고 양념이 잘 배었습니다.',
  메추리알장조림:
    '메추리알을 간장에 졸이고 꽈리고추와 양파로 단맛을 더해 부담 없이 즐길 수 있습니다.',
  갈치조림:
    '갈치를 무와 함께 칼칼하게 조려, 국물까지 밥에 비벼 먹기 좋은 조림입니다.',
  연근조림:
    '연근을 간장과 올리고당으로 달콤하게 졸이고 식초로 깔끔한 맛을 살렸습니다.',
  무조림:
    '무를 간장과 고춧가루 양념에 푹 졸여, 부드러운 식감과 칼칼한 풍미를 담았습니다.',
  우엉조림:
    '우엉을 간장과 올리고당에 졸여 아삭한 식감과 은은한 단맛을 살렸습니다.',

  // =========================
  // 찜 (steam)
  // =========================
  계란찜:
    '계란을 몽글몽글하게 찌고 대파를 더해 부드럽고 따뜻한 한 그릇 반찬입니다.',
  갈비찜:
    '소갈비를 간장 양념에 부드럽게 익히고 무와 당근을 더해 깊은 단짠 맛을 냈습니다.',
  닭찜: '닭고기를 간장 양념에 감자, 당근과 함께 졸여 촉촉하고 든든한 찜요리입니다.',
  등갈비찜:
    '등갈비를 간장과 마늘 양념에 푹 익혀 살이 부드럽게 발라지는 찜입니다.',
  아구찜:
    '아구와 콩나물을 얼큰하게 볶아 찜으로 만들고, 매콤한 양념이 진하게 배었습니다.',
  콩나물찜:
    '아삭한 콩나물을 칼칼하게 찌고 간장 양념으로 마무리해 깔끔하게 즐길 수 있습니다.',
  해물찜:
    '오징어, 새우, 홍합을 매콤하게 찜으로 만들어 해산물의 감칠맛을 살렸습니다.',
  단호박찜:
    '단호박을 촉촉하게 찌고 꿀과 견과류로 달콤고소한 풍미를 더했습니다.',
  만두찜:
    '만두를 촉촉하게 쪄 양배추와 함께 담고, 간장·식초 소스에 찍어 먹기 좋습니다.',
  수육찜:
    '돼지고기를 된장과 생강으로 삶아 부드럽게 익히고, 잡내 없이 담백하게 즐길 수 있습니다.',

  // =========================
  // 튀김 (fry)
  // =========================
  새우튀김:
    '새우를 바삭하게 튀겨 탱글한 식감이 살아있고, 소스에 찍어 먹기 좋습니다.',
  김말이튀김:
    '김말이를 바삭하게 튀겨 겉은 크리스피, 속은 촉촉한 간식 반찬입니다.',
  고구마튀김:
    '고구마를 달콤하게 튀겨 겉은 바삭, 속은 포슬한 식감을 살렸습니다.',
  오징어튀김:
    '오징어를 바삭하게 튀겨 쫄깃함과 고소함을 동시에 즐길 수 있습니다.',
  야채튀김:
    '당근, 양파, 깻잎을 튀겨 향긋하고 바삭한 한입 튀김으로 완성했습니다.',
  만두튀김:
    '만두를 노릇하게 튀겨 간장·식초에 찍어 먹기 좋은 바삭한 만두튀김입니다.',
  닭강정:
    '닭고기를 바삭하게 튀겨 간장과 올리고당 소스로 코팅해 달콤짭짤하게 즐깁니다.',
  돈가스:
    '두툼한 돼지고기에 빵가루 옷을 입혀 바삭하게 튀기고 돈까스소스로 완성했습니다.',
  치킨가라아게:
    '닭고기를 간장과 마늘로 재워 전분을 입혀 튀긴, 짭짤하고 바삭한 가라아게입니다.',
  고추튀김:
    '고추 속에 돼지고기와 당면을 채우고 바삭하게 튀겨 매콤함과 고소함을 담았습니다.',
};

function getContent(name, categoryKey) {
  return (
    contentByName[name] ??
    `${name}은(는) ${getIngredients(name, categoryKey).join(
      ', '
    )}를 사용해 정성껏 준비했습니다.`
  );
}

function getIngredients(name, categoryKey) {
  return (
    ingredientsByName[name] ??
    fallbackIngredientsByCategory[categoryKey] ?? ['재료', '양념']
  );
}

function makeImageUrl(categoryKey, index) {
  // 외부 이미지 placeholder (프론트에서 쓸 경우 next/image remotePatterns 설정 필요)
  return `https://picsum.photos/seed/eatda-${categoryKey}-${index}/600/600`;
}

function getImage(name, categoryKey, index) {
  const mapped = imagesByName[name];
  if (mapped) {
    return {
      path: mapped,
      name: `${name}.webp`, // 파일명은 원하는 규칙으로 바꿔도 됨
    };
  }

  // fallback (매핑 없으면 기존 picsum)
  return {
    path: makeImageUrl(categoryKey, index),
    name: `banchan_${categoryKey}_${String(index).padStart(2, '0')}.png`,
  };
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice(min, max, unit = 100) {
  const minUnit = Math.ceil(min / unit);
  const maxUnit = Math.floor(max / unit);
  return randomBetween(minUnit, maxUnit) * unit;
}

function pickSellerIdByIndex(i) {
  // 제품 인덱스에 따라 판매자 10명에 분배
  return sellers[(i - 1) % sellers.length].seller_id;
}

function createProducts({ startId = 1 } = {}) {
  const now = formatKST(new Date());
  let id = startId;

  const products = [];

  const priceRangeByCategory = {
    main: [9000, 16000],
    soup: [7000, 12000],
    side: [3000, 8000],
    stir: [6000, 12000],
    braise: [7000, 14000],
    steam: [7000, 15000],
    fry: [5000, 11000],
  };

  categories.forEach((cat) => {
    const [min, max] = priceRangeByCategory[cat.key] ?? [4500, 16000];

    cat.items.forEach((name, idx) => {
      const sellerId = pickSellerIdByIndex(id);

      products.push({
        _id: id,
        createdAt: now,
        updatedAt: now,
        seller_id: sellerId,
        price: randomPrice(min, max),
        show: true,
        active: true,
        name,
        quantity: randomBetween(30, 300),
        buyQuantity: randomBetween(0, 30),
        mainImages: [getImage(name, cat.key, idx + 1)],
        content: getContent(name, cat.key),
        extra: {
          isNew: idx < 3,
          isBest: idx % 4 === 0,
          category: [cat.key],
          categoryLabel: cat.label,

          // ✅ 상세용 확장 데이터
          ingredients: getIngredients(name, cat.key),
          description: getContent(name, cat.key),
          serving: defaultServing,
          pickupPlace: defaultPickupPlace,
        },
      });

      id += 1;
    });
  });

  return products;
}

const products = createProducts({ startId: 1 });

// ✅ 리뷰 템플릿 (rating별로 다른 내용)
const reviewTemplates = {
  5: [
    {
      title: '최고예요!',
      content: '정말 맛있어요! 집밥 느낌 그대로네요. 재주문 의사 100%입니다.',
    },
    {
      title: '감동적인 맛',
      content:
        '어머니가 해주신 반찬 맛이 나서 감동받았어요. 자주 시켜먹을게요!',
    },
    {
      title: '완벽해요',
      content: '양도 넉넉하고 맛도 훌륭해요. 포장도 꼼꼼하게 해주셨네요.',
    },
    {
      title: '대만족',
      content: '기대 이상이에요! 신선하고 간도 딱 맞아요. 강추합니다.',
    },
    {
      title: '최고의 선택',
      content: '여기저기 시켜봤는데 여기가 제일 맛있어요. 단골 확정!',
    },
    {
      title: '너무 좋아요',
      content: '반찬 퀄리티가 정말 좋아요. 집에서 해먹기 귀찮을 때 딱이에요.',
    },
  ],
  4: [
    {
      title: '맛있어요',
      content: '전체적으로 맛있었어요. 양이 조금 더 많으면 좋겠어요.',
    },
    {
      title: '괜찮아요',
      content: '깔끔한 맛이에요. 다음에 또 주문할 것 같아요.',
    },
    {
      title: '만족합니다',
      content: '가격 대비 괜찮아요. 맛도 좋고 포장도 잘 되어있어요.',
    },
    {
      title: '좋아요',
      content: '집밥 느낌 나서 좋았어요. 조금 더 짜지 않았으면 좋겠어요.',
    },
    {
      title: '재주문 의사 있어요',
      content: '맛있게 잘 먹었습니다. 다음에 다른 메뉴도 시켜볼게요.',
    },
    {
      title: '괜찮은 편',
      content: '무난하게 맛있어요. 특별히 나쁜 점은 없었어요.',
    },
  ],
  3: [
    {
      title: '보통이에요',
      content: '기대했던 것보다는 평범했어요. 나쁘진 않아요.',
    },
    {
      title: '그냥 그래요',
      content: '맛은 괜찮은데 양이 좀 적어요. 가격 대비 아쉬워요.',
    },
    {
      title: '평범해요',
      content: '특별히 맛있다고 느끼진 못했어요. 무난한 맛이에요.',
    },
    {
      title: '아쉬워요',
      content: '간이 좀 맞지 않았어요. 다음엔 다른 메뉴 시켜볼게요.',
    },
    { title: '기대 이하', content: '사진보다 양이 적어서 좀 아쉬웠어요.' },
  ],
  2: [
    {
      title: '별로예요',
      content: '맛이 기대에 못 미쳤어요. 개선이 필요할 것 같아요.',
    },
    {
      title: '아쉬운 점이 많아요',
      content: '간이 너무 짜고 양도 적어요. 재주문은 고민될 것 같아요.',
    },
    { title: '기대와 달랐어요', content: '사진이랑 많이 달라서 실망했어요.' },
  ],
  1: [
    {
      title: '실망이에요',
      content: '맛이 너무 없어요. 환불받고 싶을 정도예요.',
    },
    {
      title: '다시는 안 시켜요',
      content: '배송도 늦고 맛도 없어요. 비추천합니다.',
    },
  ],
};

// ✅ 리뷰 생성 함수
function createReviews(products, users) {
  const reviews = [];
  let reviewId = 1;
  let orderId = 1;

  products.forEach((product) => {
    // 각 상품당 3~9개의 리뷰 랜덤 생성
    const reviewCount = randomBetween(3, 9);
    const usedUserIds = new Set();

    for (let i = 0; i < reviewCount; i++) {
      // 같은 상품에 같은 유저가 중복 리뷰하지 않도록
      let user;
      do {
        user = users[randomBetween(0, users.length - 1)];
      } while (usedUserIds.has(user._id) && usedUserIds.size < users.length);
      usedUserIds.add(user._id);

      // rating 분포: 5점(40%), 4점(30%), 3점(20%), 2점(7%), 1점(3%)
      const rand = Math.random() * 100;
      let rating;
      if (rand < 40) rating = 5;
      else if (rand < 70) rating = 4;
      else if (rand < 90) rating = 3;
      else if (rand < 97) rating = 2;
      else rating = 1;

      const templates = reviewTemplates[rating];
      const template = templates[randomBetween(0, templates.length - 1)];

      reviews.push({
        _id: reviewId,
        user_id: user._id,
        user: {
          _id: user._id,
          name: user.name,
          image: user.image,
        },
        order_id: orderId,
        product_id: product._id,
        rating,
        content: template.content,
        extra: {
          title: template.title,
        },
        createdAt: formatKST(
          new Date(Date.now() - randomBetween(1, 90) * 24 * 60 * 60 * 1000)
        ),
      });

      reviewId++;
      orderId++;
    }
  });

  return reviews;
}

const reviews = createReviews(products, users);

module.exports = {
  sellers,
  users,
  products,
  reviews,
};
