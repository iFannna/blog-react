import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DOC_SECTIONS, getDocSection } from "./sections";
import {
  DOC_LOCALES,
  type DocLocale,
  type DocSourceMeta,
  type DocsNavGroup,
  type DocsNavItem,
  type ResolvedDocPage,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content", "docs");

const DEFAULT_GROUP: Record<DocLocale, string> = {
  "zh-CN": "文档",
  "en-US": "Documents",
};

interface CacheEntry {
  pages: DocSourceMeta[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2000;

function isSafeSlug(slug: string[]): boolean {
  return slug.every(
    (part) =>
      part.length > 0 &&
      part !== "." &&
      part !== ".." &&
      !part.includes("/") &&
      !part.includes("\\") &&
      !part.includes("\0"),
  );
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function readPage(filePath: string, locale: DocLocale, section: string): DocSourceMeta {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`文档缺少 title frontmatter: ${filePath}`);
  }

  const relative = path
    .relative(path.join(CONTENT_ROOT, locale, section), filePath)
    .replace(/\\/g, "/")
    .replace(/\.md$/, "");
  const slug = relative.split("/");

  return {
    title: data.title,
    description:
      typeof data.description === "string" ? data.description : undefined,
    group: typeof data.group === "string" ? data.group : undefined,
    order: typeof data.order === "number" ? data.order : undefined,
    draft: data.draft === true,
    section,
    locale,
    slug,
    slugPath: relative,
    filePath,
  };
}

function loadPages(locale: DocLocale, section: string): DocSourceMeta[] {
  const cacheKey = `${locale}/${section}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > now) return cached.pages;

  const dir = path.join(CONTENT_ROOT, locale, section);
  const pages = walkMarkdownFiles(dir)
    .map((filePath) => readPage(filePath, locale, section))
    .filter((page) => page.draft !== true)
    .sort((a, b) => {
      const orderDiff = (a.order ?? 1000) - (b.order ?? 1000);
      return orderDiff !== 0 ? orderDiff : a.title.localeCompare(b.title);
    });

  cache.set(cacheKey, { pages, expiresAt: now + CACHE_TTL_MS });
  return pages;
}

export function listDocPages(locale: DocLocale, section: string): DocSourceMeta[] {
  return loadPages(locale, section);
}

export function getDocPage(
  locale: DocLocale,
  section: string,
  slug: string[],
): DocSourceMeta | undefined {
  if (!isSafeSlug(slug)) return undefined;

  const slugPath = slug.join("/");
  return loadPages(locale, section).find((page) => page.slugPath === slugPath);
}

function otherLocale(locale: DocLocale): DocLocale {
  return locale === "zh-CN" ? "en-US" : "zh-CN";
}

export function resolveDocPage(
  locale: DocLocale,
  section: string,
  slug: string[],
): ResolvedDocPage | undefined {
  const own = getDocPage(locale, section, slug);
  if (own) return { meta: own, actualLocale: locale, fallback: false };

  const other = otherLocale(locale);
  const fallbackPage = getDocPage(other, section, slug);
  if (fallbackPage) {
    return { meta: fallbackPage, actualLocale: other, fallback: true };
  }

  return undefined;
}

/** 两个 locale 的并集，保证缺少译文时仍能通过 URL 访问并回退 */
function unionSlugPaths(section: string): string[] {
  const paths = new Set<string>();

  for (const locale of DOC_LOCALES) {
    for (const page of loadPages(locale, section)) paths.add(page.slugPath);
  }

  return [...paths].sort((a, b) => {
    const aPage = getDocPage("zh-CN", section, a.split("/")) ?? getDocPage("en-US", section, a.split("/"));
    const bPage = getDocPage("zh-CN", section, b.split("/")) ?? getDocPage("en-US", section, b.split("/"));
    const orderDiff = (aPage?.order ?? 1000) - (bPage?.order ?? 1000);
    return orderDiff !== 0 ? orderDiff : (aPage?.title ?? a).localeCompare(bPage?.title ?? b);
  });
}

export function getDocStaticParams(): Array<{
  locale: DocLocale;
  section: string;
  slug: string[];
}> {
  const params: Array<{ locale: DocLocale; section: string; slug: string[] }> = [];

  for (const section of DOC_SECTIONS) {
    for (const slugPath of unionSlugPaths(section.id)) {
      for (const locale of DOC_LOCALES) {
        params.push({ locale, section: section.id, slug: slugPath.split("/") });
      }
    }
  }

  return params;
}

export function getSectionNav(locale: DocLocale, section: string): DocsNavGroup[] {
  if (!getDocSection(section)) return [];

  const grouped = new Map<string, DocsNavItem[]>();
  const groupOrder = new Map<string, number>();

  for (const slugPath of unionSlugPaths(section)) {
    const slug = slugPath.split("/");
    const resolved = resolveDocPage(locale, section, slug);
    if (!resolved) continue;

    const { meta } = resolved;
    const groupTitle = meta.group ?? DEFAULT_GROUP[locale];
    const items = grouped.get(groupTitle) ?? [];

    items.push({
      title: meta.title,
      href: `/docs/${locale}/${section}/${meta.slugPath}`,
      done: true,
    });

    grouped.set(groupTitle, items);
    groupOrder.set(groupTitle, Math.min(groupOrder.get(groupTitle) ?? Infinity, meta.order ?? 1000));
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => {
      const orderDiff = (groupOrder.get(a) ?? 1000) - (groupOrder.get(b) ?? 1000);
      return orderDiff !== 0 ? orderDiff : a.localeCompare(b);
    })
    .map(([title, items]) => ({ title, items }));
}

export function getFirstDocPath(locale: DocLocale, section: string): string | undefined {
  // Overview 是手写页面，不在 Markdown 导航里，组件文档入口固定落到总览
  if (section === "element-plus") {
    return `/docs/${locale}/element-plus/components/overview`;
  }

  const [firstGroup] = getSectionNav(locale, section);
  const first = firstGroup?.items[0];

  return first?.href;
}

export function getAdjacentPages(
  locale: DocLocale,
  section: string,
  slug: string[],
): { prev?: DocsNavItem; next?: DocsNavItem } {
  const currentHref = `/docs/${locale}/${section}/${slug.join("/")}`;
  const flat = getSectionNav(locale, section).flatMap((group) => group.items);
  const index = flat.findIndex((item) => item.href === currentHref);

  if (index === -1) return {};

  return { prev: flat[index - 1], next: flat[index + 1] };
}

export function readDocSource(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
