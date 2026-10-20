import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 已迁移到 Markdown 管线的页面，旧地址永久跳转到带 locale 的新地址
const EP_CONTENT_DIR = path.join(
  process.cwd(),
  "src/content/docs/zh-CN/element-plus/components",
);
const migratedSlugs = fs.existsSync(EP_CONTENT_DIR)
  ? fs
      .readdirSync(EP_CONTENT_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""))
  : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000"],
  async redirects() {
    return [
      {
        source: "/docs/element-plus",
        destination: "/docs/zh-CN/element-plus",
        permanent: true,
      },
      ...migratedSlugs.map((slug) => ({
        source: `/docs/element-plus/components/${slug}`,
        destination: `/docs/zh-CN/element-plus/components/${slug}`,
        permanent: true,
      })),
    ];
  },
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
