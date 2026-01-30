import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zipbanchan.godohosting.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-ddanzi.bizhost.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thingool123.godohosting.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zipbanchan.godohosting.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
