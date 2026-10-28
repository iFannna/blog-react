import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  // 运行镜像只装 standalone 依赖子集，避免 1.4G 全量 node_modules
  output: "standalone",
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
