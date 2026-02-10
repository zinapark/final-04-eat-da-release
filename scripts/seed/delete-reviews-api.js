/**
 * 외부 API에서 리뷰를 전체 삭제하는 스크립트
 * 사용법: node scripts/seed/delete-reviews-api.js
 */

const { users } = require("./seed-data");

const API_URL = "https://fesp-api.koyeb.app/market";
const CLIENT_ID = "febc15-final04-ecad";

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

async function getMyReplies(token) {
  const replies = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${API_URL}/replies?page=${page}&limit=100`, {
      headers: {
        "client-id": CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) break;

    const data = await res.json();
    if (!data.item || data.item.length === 0) break;

    replies.push(...data.item);

    if (page >= (data.pagination?.totalPages ?? 1)) break;
    page++;
  }

  return replies;
}

async function deleteReply(token, replyId) {
  const res = await fetch(`${API_URL}/replies/${replyId}`, {
    method: "DELETE",
    headers: {
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`삭제 실패 (reply ${replyId}): ${res.status} - ${text}`);
  }
}

async function main() {
  console.log("🗑️  외부 API 리뷰 전체 삭제 시작...\n");

  let totalDeleted = 0;

  for (const user of users) {
    try {
      const token = await login(user.email, user.password);
      const replies = await getMyReplies(token);

      if (replies.length === 0) {
        console.log(`👤 ${user.name} - 리뷰 없음`);
        continue;
      }

      console.log(`👤 ${user.name} - 리뷰 ${replies.length}개 삭제 중...`);

      for (const reply of replies) {
        try {
          await deleteReply(token, reply._id);
          totalDeleted++;
          process.stdout.write(".");
        } catch (err) {
          console.log(`\n  ❌ ${err.message}`);
        }
      }
      console.log(" ✓");
    } catch (err) {
      console.log(`  ❌ ${user.name}: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n✅ 완료! 총 ${totalDeleted}개 리뷰 삭제됨`);
}

main().catch((e) => {
  console.error("❌ 스크립트 실패:", e);
  process.exit(1);
});
