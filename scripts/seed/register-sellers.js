// /scripts/seed/register-sellers.js
// 외부 FESP API에 셀러들을 회원가입시키는 스크립트

const { sellers } = require("./seed-data");

const API_URL = "https://fesp-api.koyeb.app/market";
const CLIENT_ID = "febc15-final04-ecad";

async function registerSeller(seller) {
  const body = {
    email: seller.email,
    password: seller.password,
    name: seller.name,
    phone: seller.phone,
    address: seller.address,
    type: "seller",
  };

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": CLIENT_ID,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${seller.name} (${seller.email}) 회원가입 성공`);
      return { success: true, seller, data };
    } else {
      console.log(`❌ ${seller.name} (${seller.email}) 실패:`, data.message || data);
      return { success: false, seller, error: data };
    }
  } catch (error) {
    console.log(`❌ ${seller.name} (${seller.email}) 에러:`, error.message);
    return { success: false, seller, error };
  }
}

async function registerAllSellers() {
  console.log("🚀 셀러 회원가입 시작...\n");
  console.log(`총 ${sellers.length}명의 셀러를 등록합니다.\n`);

  const results = [];

  for (const seller of sellers) {
    const result = await registerSeller(seller);
    results.push(result);
    // API rate limit 방지를 위해 잠시 대기
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log("\n========================================");
  console.log(`✅ 성공: ${successCount}명`);
  console.log(`❌ 실패: ${failCount}명`);
  console.log("========================================");

  if (failCount > 0) {
    console.log("\n실패한 셀러 목록:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`- ${r.seller.name} (${r.seller.email})`);
      });
  }
}

registerAllSellers().catch((e) => {
  console.error("❌ 스크립트 실행 실패:", e);
  process.exit(1);
});
