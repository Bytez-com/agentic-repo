import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  images: {
    remotePatterns: [new URL("https://cdn.bytez.com/images/inference/**")],
  },
};

export default nextConfig;
