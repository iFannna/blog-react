import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocPager from "../../../../_components/DocPager";
import {
  getAdjacentPages,
  getDocStaticParams,
  readDocSource,
  resolveDocPage,
} from "@/lib/docs/content";
import { DOCS_MESSAGES } from "@/lib/docs/i18n";
import { getElementPlusAdjacentPages } from "@/lib/docs/element-plus-nav";
import DocsMarkdown from "@/lib/docs/markdown";
import { getDocSection } from "@/lib/docs/sections";
import { isDocLocale } from "@/lib/docs/types";

export const dynamicParams = false;

interface DocPageParams {
  locale: string;
  section: string;
  slug: string[];
}

export function generateStaticParams() {
  return getDocStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DocPageParams>;
}): Promise<Metadata> {
  const { locale, section, slug } = await params;

  if (!isDocLocale(locale) || !getDocSection(section)) return {};

  const resolved = resolveDocPage(locale, section, slug);
  if (!resolved) return {};

  const { meta } = resolved;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/docs/${locale}/${section}/${meta.slugPath}`,
      languages: {
        "zh-CN": `/docs/zh-CN/${section}/${meta.slugPath}`,
        "en-US": `/docs/en-US/${section}/${meta.slugPath}`,
      },
    },
  };
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<DocPageParams>;
}) {
  const { locale, section, slug } = await params;

  if (!isDocLocale(locale) || !getDocSection(section)) notFound();

  const resolved = resolveDocPage(locale, section, slug);
  if (!resolved) notFound();

  const { meta, fallback } = resolved;
  const adjacent =
    section === "element-plus"
      ? getElementPlusAdjacentPages(locale, meta.slugPath)
      : getAdjacentPages(locale, section, meta.slug);
  const messages = DOCS_MESSAGES[locale];

  return (
    <article className="docs-article">
      {fallback && (
        <div className="docs-fallback-notice" role="note">
          {messages.fallbackNotice}
        </div>
      )}

      <DocsMarkdown
        source={readDocSource(meta.filePath)}
        locale={locale}
        section={section}
        slug={meta.slug}
      />

      <DocPager
        locale={locale}
        prev={adjacent.prev}
        next={adjacent.next}
      />
    </article>
  );
}
