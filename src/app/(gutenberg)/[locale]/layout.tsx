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
      <body>{children}</body>
    </html>
  );
}
