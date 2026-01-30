require("dotenv").config({ path: ".env.local" });

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const { sellers, products } = require("./seed-data");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("MONGODB_URI가 없습니다. .env.local 확인!");
if (!dbName) throw new Error("MONGODB_DB가 없습니다. .env.local 확인!");

async function seed({ reset = false } = {}) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // ✅ 컬렉션명
    const productCol = db.collection("product");
    const userCol = db.collection("user");

    if (reset) {
      await productCol.deleteMany({});
      await userCol.deleteMany({ type: "seller" });
    }

    // sellers는 user 컬렉션에 type: "seller"로 저장(프로젝트에서 쓰기 좋게)
    // 비밀번호를 해시해서 저장 (로그인 가능하도록)
    const sellerDocs = await Promise.all(
      sellers.map(async (s) => {
        const hashedPassword = await bcrypt.hash(s.password, 10);
        return {
          ...s,
          password: hashedPassword,
          type: "seller",
          createdAt: new Date(),
          updatedAt: new Date(),
          extra: {
            intro: `${s.name}의 집밥을 정성껏 담아드려요.`,
            rating: 4.6,
            reviewCount: 0,
          },
        };
      }),
    );

    if (sellerDocs.length) {
      await userCol.bulkWrite(
        sellerDocs.map((seller) => ({
          updateOne: {
            filter: { seller_id: seller.seller_id },
            update: { $set: seller },
            upsert: true,
          },
        })),
        { ordered: false },
      );
    }

    if (products.length) {
      await productCol.bulkWrite(
        products.map((product) => ({
          updateOne: {
            filter: { _id: product._id }, // 또는 { seller_id, name }
            update: { $set: product },
            upsert: true,
          },
        })),
        { ordered: false },
      );
    }

    const productCount = await productCol.countDocuments();
    const sellerCount = await userCol.countDocuments({ type: "seller" });

    console.log("✅ Seed 완료!");
    console.log(`- sellers(user:type=seller): ${sellerCount}`);
    console.log(`- products(product): ${productCount}`);
  } finally {
    await client.close();
  }
}

const reset = process.argv.includes("--reset");
seed({ reset }).catch((e) => {
  console.error("❌ Seed 실패:", e);
  process.exit(1);
});
