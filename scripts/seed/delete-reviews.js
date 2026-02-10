require("dotenv").config({ path: ".env.local" });

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("MONGODB_URI가 없습니다. .env.local 확인!");
if (!dbName) throw new Error("MONGODB_DB가 없습니다. .env.local 확인!");

async function deleteReviews() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const replyCol = db.collection("reply");

    const before = await replyCol.countDocuments();
    await replyCol.deleteMany({});
    console.log(`✅ 리뷰 ${before}개 삭제 완료!`);
  } finally {
    await client.close();
  }
}

deleteReviews().catch((e) => {
  console.error("❌ 리뷰 삭제 실패:", e);
  process.exit(1);
});
