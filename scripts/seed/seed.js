require("dotenv").config({ path: ".env.local" });

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const { sellers, users, products, reviews } = require("./seed-data");

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
    const replyCol = db.collection("reply");

    if (reset) {
      await productCol.deleteMany({});
      await userCol.deleteMany({ type: "seller" });
      await userCol.deleteMany({ type: "user" });
      await replyCol.deleteMany({});
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
            ...s.extra,
            intro: s.extra?.description ?? `${s.name}의 집밥을 정성껏 담아드려요.`,
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

    // ✅ users (구매자) 저장
    const userDocs = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return {
          ...u,
          password: hashedPassword,
          type: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );

    if (userDocs.length) {
      await userCol.bulkWrite(
        userDocs.map((user) => ({
          updateOne: {
            filter: { _id: user._id },
            update: { $set: user },
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

    // ✅ reviews (구매후기) 저장
    if (reviews.length) {
      await replyCol.bulkWrite(
        reviews.map((review) => ({
          updateOne: {
            filter: { _id: review._id },
            update: { $set: review },
            upsert: true,
          },
        })),
        { ordered: false },
      );
    }

    const productCount = await productCol.countDocuments();
    const sellerCount = await userCol.countDocuments({ type: "seller" });
    const userCount = await userCol.countDocuments({ type: "user" });
    const reviewCount = await replyCol.countDocuments();

    console.log("✅ Seed 완료!");
    console.log(`- sellers(user:type=seller): ${sellerCount}`);
    console.log(`- users(user:type=user): ${userCount}`);
    console.log(`- products(product): ${productCount}`);
    console.log(`- reviews(reply): ${reviewCount}`);
  } finally {
    await client.close();
  }
}

const reset = process.argv.includes("--reset");
seed({ reset }).catch((e) => {
  console.error("❌ Seed 실패:", e);
  process.exit(1);
});
