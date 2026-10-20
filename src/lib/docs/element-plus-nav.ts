import "server-only";

import { DOC_NAV } from "@/app/(docs)/_components/nav-config";
import { resolveDocPage } from "./content";
import type { DocLocale, DocsNavGroup } from "./types";

const COMPONENT_SLUG = "components";

/**
 * Overview 是手写页面，内容不在 markdown 里，
 * 但它同样有 /docs/<locale>/element-plus/components/overview 路由。
 */
const STATIC_PAGE_SLUGS = new Set(["overview"]);

/**
 * 迁移期间新旧路由并存：已有本地化页面（markdown 或手写）的条目走新地址，
 * 其余条目继续指向旧的中文页面，避免侧边栏出现 404。
 */
export function getElementPlusSectionNav(locale: DocLocale): DocsNavGroup[] {
  return DOC_NAV.map((group) => ({
    title:
      locale === "zh-CN" ? group.title : group.title.split(" ")[0],
    items: group.items.map((item) => {
      const migrated =
        STATIC_PAGE_SLUGS.has(item.slug) ||
        resolveDocPage(locale, "element-plus", [COMPONENT_SLUG, item.slug]) !==
          undefined;

      return {
        // 中文站用官方「英文 + 中文」标题，英文站只保留英文
        title: locale === "zh-CN" ? (item.titleZh ?? item.title) : item.title,
        href: migrated
          ? `/docs/${locale}/element-plus/${COMPONENT_SLUG}/${item.slug}`
          : `/docs/element-plus/${COMPONENT_SLUG}/${item.slug}`,
        done: true,
      };
    }),
  }));
}
