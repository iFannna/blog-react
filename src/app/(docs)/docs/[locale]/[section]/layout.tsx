import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import DocsLayout from "../../../_components/DocsLayout";
import { getSectionNav } from "@/lib/docs/content";
import { getDocsHeaderConfig, getDocSection } from "@/lib/docs/sections";
import { isDocLocale } from "@/lib/docs/types";

export default async function DocsSectionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;

  if (!isDocLocale(locale) || !getDocSection(section)) notFound();

  return (
    <DocsLayout
      header={getDocsHeaderConfig(locale)}
      nav={getSectionNav(locale, section)}
      basePath={`/docs/${locale}/${section}`}
      locale={locale}
    >
      {children}
    </DocsLayout>
  );
}
