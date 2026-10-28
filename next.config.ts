import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000"],
  // 部署构建前已本地跑过 tsc，容器内跳过重复检查以缩短构建
  typescript: { ignoreBuildErrors: process.env.SKIP_TYPECHECK === "1" },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/:path*`,
      },
    ];
  },
};

export default nextConfig;
