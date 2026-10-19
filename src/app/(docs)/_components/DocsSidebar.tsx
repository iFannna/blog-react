"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_NAV } from "./nav-config";

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      {DOC_NAV.map((group) => (
        <section className="docs-sidebar-group" key={group.title}>
          <p className="docs-sidebar-group__title">{group.title}</p>
          {group.items.map((item) => {
            const href = `/docs/element-plus/components/${item.slug}`;
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
                <span className={classes} key={item.slug}>
                  {item.title}
                </span>
              );
            }

            return (
              <Link className={classes} href={href} key={item.slug}>
                {item.title}
              </Link>
            );
          })}
        </section>
      ))}
    </aside>
  );
}
