import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co"
      }
    ]
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
