import type { Metadata } from "next";
import Link from "next/link";
import { Heading } from "../../../../_components/Heading";
import { DOC_NAV } from "../../../../_components/nav-config";

export const metadata: Metadata = {
  title: "Overview 组件总览",
};

export default function ComponentsOverview() {
  return (
    <>
      <h1>Overview 组件总览</h1>
      <p>
        Element Plus 组件库基于 React 复刻，类名与 CSS 变量沿用官方
        <code>el-*</code> 约定，样式直接编译自官方 theme-chalk。
      </p>

      {DOC_NAV.filter((group) => group.title !== "Overview 组件总览").map(
        (group) => (
          <section className="docs-overview-group" key={group.title}>
            <Heading level={2}>{group.title}</Heading>
            <div className="docs-overview-grid">
              {group.items.map((item) => {
                const classes = [
                  "docs-overview-card",
                  !item.done && "is-todo",
                ]
                  .filter(Boolean)
                  .join(" ");

                if (!item.done) {
                  return (
                    <span className={classes} key={item.slug}>
                      {item.title}
                    </span>
                  );
                }

                return (
                  <Link
                    className={classes}
                    href={`/docs/element-plus/components/${item.slug}`}
                    key={item.slug}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </section>
        ),
      )}
    </>
  );
}
