import "server-only";

import { DOC_NAV } from "@/app/(docs)/_components/nav-config";
import type { DocLocale, DocsNavGroup, DocsNavItem } from "./types";

const COMPONENT_SLUG = "components";

export function getElementPlusSectionNav(locale: DocLocale): DocsNavGroup[] {
  return DOC_NAV.map((group) => ({
    title:
      locale === "zh-CN" ? group.title : group.title.split(" ")[0],
    items: group.items.map((item) => ({
      // 中文站用官方「英文 + 中文」标题，英文站只保留英文
      title: locale === "zh-CN" ? (item.titleZh ?? item.title) : item.title,
      href: `/${locale}/docs/element-plus/${COMPONENT_SLUG}/${item.slug}`,
      done: true,
    })),
  }));
}

/**
 * 上下页必须和侧边栏共用同一份导航，否则 overview 等不在 markdown 里的
 * 手写页面会从序列中缺失，顺序也会退回 frontmatter 的 group/order。
 */
export function getElementPlusAdjacentPages(
  locale: DocLocale,
  slugPath: string,
): { prev?: DocsNavItem; next?: DocsNavItem } {
  const href = `/${locale}/docs/element-plus/${slugPath}`;
  const flat = getElementPlusSectionNav(locale).flatMap((group) => group.items);
  const index = flat.findIndex((item) => item.href === href);

  if (index === -1) return {};

  return { prev: flat[index - 1], next: flat[index + 1] };
}
