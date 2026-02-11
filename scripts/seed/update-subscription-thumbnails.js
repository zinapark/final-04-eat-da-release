// /scripts/seed/update-subscription-thumbnails.js
// 모든 구독권 상품에 썸네일 이미지를 등록하는 스크립트
// 사용법: node scripts/seed/update-subscription-thumbnails.js

const API_URL = "https://fesp-api.koyeb.app/market";
const CLIENT_ID = "febc15-final04-ecad";
const THUMBNAIL_URL =
  "https://res.cloudinary.com/ddedslqvv/image/upload/v1770270426/febc15-final04-ecad/WR-ZtdOUy.jpg";
const DEFAULT_PASSWORD = "eatda1234";

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

const PASSWORDS = [DEFAULT_PASSWORD, "qwer1234"];

// 판매자 로그인 (여러 비밀번호 시도)
async function loginSeller(email) {
  for (const password of PASSWORDS) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": CLIENT_ID,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.ok) {
      return data.item.token.accessToken;
    }
  }
  return null;
}

// 판매자의 상품 조회
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

// 상품 썸네일 업데이트
async function updateProductThumbnail(accessToken, productId) {
  const response = await fetch(`${API_URL}/seller/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      mainImages: [
        {
          path: THUMBNAIL_URL,
          name: "subscription-thumbnail.jpg",
          originalname: "subscription-thumbnail.jpg",
        },
      ],
    }),
  });

  const data = await response.json();
  return data.ok;
}

// 메인 실행
async function main() {
  console.log("🚀 구독권 썸네일 업데이트 시작...\n");

  const sellers = await getSellers();
  console.log(`총 ${sellers.length}명의 판매자를 찾았습니다.\n`);

  let updatedCount = 0;
  let failCount = 0;

  for (const seller of sellers) {
    // 판매자의 상품 조회
    const products = await getSellerProducts(seller._id);
    const subscriptionProducts = products.filter(
      (p) => p.extra?.isSubscription === true
    );

    if (subscriptionProducts.length === 0) {
      continue;
    }

    console.log(
      `📌 ${seller.name} (${seller.email}) - 구독권 ${subscriptionProducts.length}개 발견`
    );

    // 로그인
    const accessToken = await loginSeller(seller.email);
    if (!accessToken) {
      console.log(`  ❌ 로그인 실패`);
      failCount += subscriptionProducts.length;
      continue;
    }

    // 각 구독권 썸네일 업데이트
    for (const product of subscriptionProducts) {
      const success = await updateProductThumbnail(accessToken, product._id);
      if (success) {
        updatedCount++;
        console.log(`  ✅ "${product.name}" 썸네일 업데이트 완료`);
      } else {
        failCount++;
        console.log(`  ❌ "${product.name}" 업데이트 실패`);
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("\n========================================");
  console.log(`✅ 업데이트 성공: ${updatedCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log("========================================");
}

main().catch((e) => {
  console.error("❌ 스크립트 실행 실패:", e);
  process.exit(1);
});
