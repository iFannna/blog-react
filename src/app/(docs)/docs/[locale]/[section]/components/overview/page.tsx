import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocPager from "../../../../../_components/DocPager";
import { OverviewContent } from "../../../../../_components/OverviewContent";
import { getElementPlusAdjacentPages } from "@/lib/docs/element-plus-nav";
import { isDocLocale } from "@/lib/docs/types";

interface OverviewParams {
  locale: string;
  section: string;
}

function isElementPlusOverview(section: string) {
  return section === "element-plus";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<OverviewParams>;
}): Promise<Metadata> {
  const { locale, section } = await params;

  if (!isDocLocale(locale) || !isElementPlusOverview(section)) return {};

  return {
    title: locale === "zh-CN" ? "Overview 组件总览" : "Overview",
    alternates: {
      canonical: `/docs/${locale}/element-plus/components/overview`,
      languages: {
        "zh-CN": "/docs/zh-CN/element-plus/components/overview",
        "en-US": "/docs/en-US/element-plus/components/overview",
      },
    },
  };
}

export default async function ComponentsOverviewPage({
  params,
}: {
  params: Promise<OverviewParams>;
}) {
  const { locale, section } = await params;

  if (!isDocLocale(locale) || !isElementPlusOverview(section)) notFound();

  const zh = locale === "zh-CN";
  const adjacent = getElementPlusAdjacentPages(locale, "components/overview");

  return (
    <>
      <h1>{zh ? "Overview 组件总览" : "Overview"}</h1>
      <p>
        {zh ? (
          <>
            Element Plus 组件库基于 React 复刻，类名与 CSS 变量沿用官方
            <code>el-*</code> 约定，样式直接编译自官方 theme-chalk。
          </>
        ) : (
          <>
            A React re-implementation of Element Plus. Class names and CSS
            variables follow the official <code>el-*</code> conventions, with
            styles compiled directly from the official theme-chalk.
          </>
        )}
      </p>
      <OverviewContent locale={locale} />
      <DocPager locale={locale} prev={adjacent.prev} next={adjacent.next} />
    </>
  );
}
