"use client";

import { useMemo, useState } from "react";
import CategoryTabs, {
  CategoryLabel,
} from "@/app/products/components/CategoryTabs";
import ProductCard from "@/app/src/components/ui/ProductCard";
import { Product } from "@/app/src/types";

const labelToKey: Record<Exclude<CategoryLabel, "전체">, string> = {
  메인반찬: "main",
  국물: "soup",
  찜: "steam",
  볶음: "stir",
  조림: "braise",
  튀김: "fry",
  밑반찬: "side",
};

function matchesCategory(product: Product, selected: CategoryLabel) {
  if (selected === "전체") return true;

  const key = labelToKey[selected];
  const keys = product.extra?.category ?? [];
  const label = product.extra?.categoryLabel ?? "";

  return keys.includes(key) || label === selected;
}

interface ProductsListClientProps {
  products: Product[];
}

export default function ProductsListClient({
  products,
}: ProductsListClientProps) {
  const [selected, setSelected] = useState<CategoryLabel>("전체");

  const filtered = useMemo(() => {
    return products.filter((p) => matchesCategory(p, selected));
  }, [products, selected]);

  return (
    <>
      <CategoryTabs value={selected} onChange={setSelected} />

      <div className="mt-25 mb-16 grid grid-cols-2">
        {filtered.map((product, index) => (
          <ProductCard
            key={product._id}
            productId={product._id}
            imageSrc={product.mainImages?.[0]?.path ?? "/food1.png"}
            chefName={`${product.seller?.name ?? "주부"}`}
            dishName={product.name}
            rating={product.rating ?? 0}
            reviewCount={product.replies ?? 0}
            price={product.price}
            initialWished={Boolean(product.myBookmarkId)}
            isLcp={index === 0}
          />
        ))}
      </div>
    </>
  );
}
