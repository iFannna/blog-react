"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElTag } from "@/components/element-plus/tag";
import { ElSwitch } from "@/components/element-plus/switch";
import { useTheme } from "@/hooks/theme";

/** 与官方文档站顶栏展示的版本号保持一致 */
const ELEMENT_PLUS_VERSION = "2.14.6";

/**
 * activePrefix 是对应的路由段：指南与资源暂未实现，
 * 因此当前只可能命中「组件」这一项。
 */
const NAV_ITEMS = [
  {
    text: "指南",
    href: "/docs/element-plus/components/overview",
    activePrefix: "/docs/element-plus/guide",
  },
  {
    text: "组件",
    href: "/docs/element-plus/components/overview",
    activePrefix: "/docs/element-plus/components",
  },
  {
    text: "资源",
    href: "/docs/element-plus/components/overview",
    activePrefix: "/docs/element-plus/resource",
  },
];

/**
 * 官方开关用的是 Material 的 light_mode / dark_mode 图标，
 * 与 EP 图标集里的 Sunny / Moon 形状不同，这里按官方路径原样复刻。
 */
function LightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="light-icon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z"
      />
    </svg>
  );
}

function DarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="dark-icon" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
      />
    </svg>
  );
}

/**
 * 官方顶栏的暗色开关：容器与开关结构、圆点内图标均与官方一致，
 * 主题状态复用博客的 useTheme（同一份 localStorage），文档站与博客互相同步。
 */
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="docs-header__theme">
      <ElSwitch
        checked={isDarkMode}
        onCheckedChange={() => toggleTheme()}
        activeActionIcon={<DarkIcon />}
        inactiveActionIcon={<LightIcon />}
        ariaLabel={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
      />
    </div>
  );
}

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
            <Link href="/docs/element-plus/components/overview" aria-label="Element Plus">
              <img
                src="/images/element-plus-logo.svg"
                alt="Element Plus Logo"
              />
            </Link>
            <ElTag type="primary" size="small" round title="latest version">
              {ELEMENT_PLUS_VERSION}
            </ElTag>
          </div>

          <div className="docs-header__content">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                className={
                  pathname.startsWith(item.activePrefix)
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
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
