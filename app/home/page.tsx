import HomePageClient from "./HomePageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "잇다 홈",
  openGraph: {
    title: "잇다 홈",
    description: "홈 페이지",
    url: "/home",
  },
};

export default function Home() {
  return <HomePageClient />;
}
