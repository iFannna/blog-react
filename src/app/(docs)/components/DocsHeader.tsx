"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { text: "指南", href: "/components/overview" },
  { text: "组件", href: "/components/overview" },
  { text: "资源", href: "/components/overview" },
];

/**
 * 对应官方 docs 的顶栏：sticky 定位、毛玻璃背景、底部 1px 分隔线。
 * 官方的搜索框与多语言切换依赖 Algolia 与 i18n，
 * 本复刻的文档站只服务于本仓库，故不引入。
 */
export default function DocsHeader() {
  const pathname = usePathname();

  return (
    <header className="docs-header">
      <div className="docs-header__wrapper">
        <div className="docs-header__container">
          <div className="docs-header__logo">
            <Link href="/components/overview">Element Plus React</Link>
          </div>

          <div className="docs-header__content">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                className={
                  pathname.startsWith("/components")
                    ? "docs-header__link is-active"
                    : "docs-header__link"
                }
              >
                {item.text}
              </Link>
            ))}
            <a
              className="docs-header__link"
              href="https://element-plus.org/zh-CN/component/overview"
              target="_blank"
              rel="noreferrer"
            >
              官方文档
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
