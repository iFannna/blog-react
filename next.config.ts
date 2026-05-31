import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "java-ai-sau.oss-cn-beijing.aliyuncs.com",
      },
    ],
  },
};

export default nextConfig;
