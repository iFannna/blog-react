import type { Metadata } from "next";
import { OverviewContent } from "./OverviewContent";

export const metadata: Metadata = {
  title: "Overview 组件总览",
};

export default function ComponentsOverview() {
  return (
    <>
      <h1>Overview 组件总览</h1>
      <p>
        Element Plus 组件库基于 React 复刻，类名与 CSS 变量沿用官方
        <code>el-*</code> 约定，样式直接编译自官方 theme-chalk。
      </p>
      <OverviewContent />
    </>
  );
}
