import "server-only";

import { DOC_NAV } from "@/app/(docs)/_components/nav-config";
import { resolveDocPage } from "./content";
import type { DocLocale, DocsNavGroup } from "./types";

const COMPONENT_SLUG = "components";

/**
 * 迁移期间新旧路由并存：已写入 src/content/docs 的页面走新地址，
 * 其余条目继续指向旧的中文页面，避免侧边栏出现 404。
 */
export function getElementPlusSectionNav(locale: DocLocale): DocsNavGroup[] {
  return DOC_NAV.map((group) => ({
    title:
      locale === "zh-CN" ? group.title : group.title.split(" ")[0],
    items: group.items.map((item) => {
      const migrated =
        item.slug !== "overview" &&
        resolveDocPage(locale, "element-plus", [COMPONENT_SLUG, item.slug]) !==
          undefined;

      return {
        title: item.title,
        href: migrated
          ? `/docs/${locale}/element-plus/${COMPONENT_SLUG}/${item.slug}`
          : `/docs/element-plus/${COMPONENT_SLUG}/${item.slug}`,
        done: true,
      };
    }),
  }));
}
