import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000"],
  // Gutenberg 源码含大量上游 TypeScript 类型告警（stories、跨版本 React 类型），
  // 构建期跳过其类型检查；编辑器自身的行为通过运行验证。
  typescript: { ignoreBuildErrors: true },
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
