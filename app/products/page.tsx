import BottomNavigation from "@/app/src/components/common/BottomNavigation";
import Header from "@/app/src/components/common/Header";
import ProductsListClient from "@/app/src/components/ui/ProductsListClient";
import { getAxios } from "@/lib/axios";

async function getProducts() {
  const axios = getAxios();
  const res = await axios.get("/products/");
  return res.data;
}

export default async function ProductsList() {
  const data = await getProducts();
  const products = data.item;

  return (
    <>
      <Header title="서교동 공유주방" showBackButton showSearch showCart />

      <ProductsListClient products={products} />

      <BottomNavigation />
    </>
  );
}
