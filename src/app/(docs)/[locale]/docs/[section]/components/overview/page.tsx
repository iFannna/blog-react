import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Pager from "@/components/docs/Pager";
import { Overview } from "@/components/docs/Overview";
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
      canonical: `/${locale}/docs/element-plus/components/overview`,
      languages: {
        "zh-CN": "/zh-CN/docs/element-plus/components/overview",
        "en-US": "/en-US/docs/element-plus/components/overview",
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
      <Overview locale={locale} />
      <Pager locale={locale} prev={adjacent.prev} next={adjacent.next} />
    </>
  );
}
