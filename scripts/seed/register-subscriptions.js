// /scripts/seed/register-subscriptions.js
// 기존 모든 판매자에게 구독권 3종을 등록하는 스크립트

const API_URL = "https://fesp-api.koyeb.app/market";
const CLIENT_ID = "febc15-final04-ecad";

// 구독권 3종 데이터
const subscriptionProducts = [
  {
    name: "가볍게 잇는 집밥",
    price: 15000,
    quantity: 999,
    content: "주 2~3회만 집밥을 먹는 분에게 추천! 주 1회 픽업, 픽업당 반찬 3종 제공",
    extra: {
      category: ["subscription"],
      categoryLabel: "구독권",
      frequency: "주 1회",
      portions: "픽업당 반찬 3종",
      isSubscription: true,
    },
  },
  {
    name: "생활에 자리 잡은 집밥",
    price: 28000,
    quantity: 999,
    content: "평일 저녁을 자주 집에서 먹는 분에게 추천! 주 2회 픽업, 픽업당 반찬 3~4종 제공",
    extra: {
      category: ["subscription"],
      categoryLabel: "구독권",
      frequency: "주 2회",
      portions: "픽업당 반찬 3~4종",
      isSubscription: true,
    },
  },
  {
    name: "식탁을 맡기는 집밥",
    price: 39000,
    quantity: 999,
    content: "거의 매일 집밥을 먹는 자취생에게 추천! 주 3회 픽업, 픽업당 반찬 4종 제공",
    extra: {
      category: ["subscription"],
      categoryLabel: "구독권",
      frequency: "주 3회",
      portions: "픽업당 반찬 4종",
      isSubscription: true,
    },
  },
];

// 모든 판매자 조회
async function getSellers() {
  const response = await fetch(`${API_URL}/users/`, {
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
    },
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error("판매자 목록 조회 실패");
  }

  return data.item.filter((user) => user.type === "seller");
}

// 판매자 로그인
async function loginSeller(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!data.ok) {
    return null;
  }

  return data.item.token.accessToken;
}

// 판매자의 기존 상품 조회 (구독권 중복 확인용)
async function getSellerProducts(sellerId) {
  const response = await fetch(`${API_URL}/products?seller_id=${sellerId}`, {
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
    },
  });

  const data = await response.json();
  return data.item || [];
}

// 구독권 등록
async function registerSubscription(accessToken, product) {
  const response = await fetch(`${API_URL}/seller/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();
  return data.ok;
}

// 메인 실행
async function main() {
  console.log("🚀 기존 판매자 구독권 등록 시작...\n");

  // 판매자 목록 조회
  const sellers = await getSellers();
  console.log(`총 ${sellers.length}명의 판매자를 찾았습니다.\n`);

  // 기본 비밀번호 (seed-data.js에서 사용하는 비밀번호)
  const defaultPassword = "eatda1234";

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const seller of sellers) {
    console.log(`\n📌 ${seller.name} (${seller.email}) 처리 중...`);

    // 기존 상품 조회하여 구독권 중복 확인
    const existingProducts = await getSellerProducts(seller._id);
    const hasSubscription = existingProducts.some(
      (p) => p.extra?.isSubscription === true
    );

    if (hasSubscription) {
      console.log(`  ⏭️ 이미 구독권이 등록되어 있습니다. 건너뜀.`);
      skipCount++;
      continue;
    }

    // 로그인 시도
    const accessToken = await loginSeller(seller.email, defaultPassword);

    if (!accessToken) {
      console.log(`  ❌ 로그인 실패 (비밀번호가 다를 수 있음)`);
      failCount++;
      continue;
    }

    // 구독권 3종 등록
    let registeredCount = 0;
    for (const product of subscriptionProducts) {
      const success = await registerSubscription(accessToken, product);
      if (success) {
        registeredCount++;
      }
      // API rate limit 방지
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    if (registeredCount === 3) {
      console.log(`  ✅ 구독권 3종 등록 완료`);
      successCount++;
    } else {
      console.log(`  ⚠️ 구독권 ${registeredCount}/3개 등록됨`);
      failCount++;
    }

    // API rate limit 방지
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("\n========================================");
  console.log(`✅ 성공: ${successCount}명`);
  console.log(`⏭️ 건너뜀 (이미 등록됨): ${skipCount}명`);
  console.log(`❌ 실패: ${failCount}명`);
  console.log("========================================");
}

main().catch((e) => {
  console.error("❌ 스크립트 실행 실패:", e);
  process.exit(1);
});
