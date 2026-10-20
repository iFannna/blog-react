"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocsNavGroup } from "@/lib/docs/types";
import { DOC_NAV } from "./nav-config";

interface DocsSidebarProps {
  /** 旧版导航条目只有 slug，需要拼上组件路由前缀 */
  basePath?: string;
  groups?: DocsNavGroup[];
}

export default function DocsSidebar({
  basePath = "/docs/element-plus/components",
  groups = DOC_NAV,
}: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      {groups.map((group) => (
        <section className="docs-sidebar-group" key={group.title}>
          <p className="docs-sidebar-group__title">{group.title}</p>
          {group.items.map((item) => {
            const href = item.href ?? `${basePath}/${item.slug}`;
            const key = href ?? item.title;
            const isActive = pathname === href;

            const classes = [
              "docs-sidebar-link",
              isActive && "is-active",
              !item.done && "is-todo",
            ]
              .filter(Boolean)
              .join(" ");

            // 未实现的组件不可点击，避免跳进空页面
            if (!item.done) {
              return (
                <span className={classes} key={key}>
                  {item.title}
                </span>
              );
            }

            return (
              <Link className={classes} href={href} key={key}>
                {item.title}
              </Link>
            );
          })}
        </section>
      ))}
    </aside>
  );
}
