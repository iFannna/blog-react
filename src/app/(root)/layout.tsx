import type { ReactNode } from "react";

/** 无语言前缀的入口页专用根布局：只承载跳转，不引入任何站点样式 */
export default function RootEntryLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}