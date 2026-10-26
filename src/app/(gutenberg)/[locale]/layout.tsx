import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isDocLocale } from "@/lib/docs/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en-US" ? "Editor" : "编辑器" };
}

/** 编辑器独立根布局：不加载博客或文档站样式，只承载全屏编辑器。 */
export default async function GutenbergRootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const lang = isDocLocale(locale) && locale === "en-US" ? "en-US" : "zh-CN";

  return (
    <html lang={lang}>
      <head>
        { /*
         * 区块编辑器样式同时作用于画布 iframe 和外壳；弹窗等外壳内 UI 依赖这份规则。
         * 它与画布共用 public 下的同一份静态资源，因此保留 link 而不是重复打包。
         */ }
        { /* eslint-disable-next-line @next/next/no-css-tags */ }
        <link rel="stylesheet" href="/canvas/block-library-editor.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
