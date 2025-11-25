import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "openinfo.uz",
        pathname: "/media/**",
      },
    ],
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@public": path.resolve(__dirname, "./public"),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
