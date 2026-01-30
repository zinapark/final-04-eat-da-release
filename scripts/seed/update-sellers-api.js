/**
 * 외부 API를 통해 판매자 정보를 업데이트하는 스크립트
 * 사용법: node scripts/seed/update-sellers-api.js
 */

const { sellers } = require("./seed-data");

const API_URL = "https://fesp-api.koyeb.app/market";
const CLIENT_ID = "febc15-final04-ecad";

// 로그인하여 토큰 획득
async function login(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`로그인 실패 (${email}): ${res.status} - ${text}`);
  }

  const data = await res.json();
  return { token: data.item.token.accessToken, userId: data.item._id };
}

// 판매자 정보 업데이트
async function updateSeller(token, userId, extra) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      extra: extra,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`업데이트 실패: ${res.status} - ${text}`);
  }

  return await res.json();
}

async function main() {
  console.log("🚀 판매자 정보 업데이트 시작...\n");

  let successCount = 0;
  let failCount = 0;

  for (const seller of sellers) {
    console.log(`👤 ${seller.name} (${seller.email}) 업데이트 중...`);

    try {
      // 로그인
      const { token, userId } = await login(seller.email, seller.password);

      // extra 업데이트 (description 포함)
      const newExtra = {
        ...seller.extra,
        intro: seller.extra?.description ?? `${seller.name}의 집밥을 정성껏 담아드려요.`,
        rating: 4.6,
        reviewCount: 0,
      };

      await updateSeller(token, userId, newExtra);
      successCount++;
      console.log(`  ✓ 완료`);
    } catch (err) {
      failCount++;
      console.log(`  ❌ 실패: ${err.message}`);
    }

    // API 부하 방지
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n✅ 완료! 성공: ${successCount}명, 실패: ${failCount}명`);
}

main().catch((e) => {
  console.error("❌ 스크립트 실패:", e);
  process.exit(1);
});
