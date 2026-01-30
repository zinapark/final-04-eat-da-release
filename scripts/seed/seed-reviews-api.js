/**
 * 외부 API를 통해 리뷰를 등록하는 스크립트
 * 사용법: node scripts/seed/seed-reviews-api.js
 */

const { users, reviews } = require("./seed-data");

const API_URL = "https://fesp-api.koyeb.app/market";
const CLIENT_ID = "febc15-final04-ecad";

// 유저별로 리뷰 그룹화
function groupReviewsByUser(reviews) {
  const grouped = {};
  reviews.forEach((review) => {
    const userId = review.user_id;
    if (!grouped[userId]) {
      grouped[userId] = [];
    }
    grouped[userId].push(review);
  });
  return grouped;
}

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
  return data.item.token.accessToken;
}

// 리뷰 등록
async function postReview(token, review) {
  const res = await fetch(`${API_URL}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: review.order_id,
      product_id: review.product_id,
      rating: review.rating,
      content: review.content,
      extra: review.extra,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`리뷰 등록 실패: ${res.status} - ${text}`);
  }

  return await res.json();
}

async function main() {
  console.log("🚀 외부 API로 리뷰 등록 시작...\n");

  // 유저별로 리뷰 그룹화
  const reviewsByUser = groupReviewsByUser(reviews);
  const userIds = Object.keys(reviewsByUser).map(Number);

  let successCount = 0;
  let failCount = 0;

  for (const userId of userIds) {
    const user = users.find((u) => u._id === userId);
    if (!user) {
      console.log(`⚠️  유저 ID ${userId} 를 찾을 수 없음, 건너뜀`);
      continue;
    }

    const userReviews = reviewsByUser[userId];
    console.log(
      `👤 ${user.name} (${user.email}) - 리뷰 ${userReviews.length}개 등록 중...`
    );

    try {
      // 로그인
      const token = await login(user.email, user.password);

      // 해당 유저의 리뷰들 등록
      for (const review of userReviews) {
        try {
          await postReview(token, review);
          successCount++;
          process.stdout.write(".");
        } catch (err) {
          failCount++;
          console.log(`\n  ❌ 리뷰 ${review._id} 실패: ${err.message}`);
        }
      }
      console.log(" ✓");
    } catch (err) {
      console.log(`  ❌ 로그인 실패: ${err.message}`);
      failCount += userReviews.length;
    }

    // API 부하 방지를 위한 딜레이
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n✅ 완료! 성공: ${successCount}개, 실패: ${failCount}개`);
}

main().catch((e) => {
  console.error("❌ 스크립트 실패:", e);
  process.exit(1);
});
