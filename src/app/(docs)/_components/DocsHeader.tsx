"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElTag } from "@/components/element-plus/tag";
import { ElSwitch } from "@/components/element-plus/switch";
import { useTheme } from "@/hooks/theme";
import { ELEMENT_PLUS_HEADER, LOCALE_LABELS } from "@/lib/docs/sections";
import {
  DOC_LOCALES,
  type DocLocale,
  type DocsHeaderConfig,
} from "@/lib/docs/types";
import { useDocsMessages } from "./DocsI18nProvider";

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
  const t = useDocsMessages();

  return (
    <div className="docs-header__theme">
      <ElSwitch
        checked={isDarkMode}
        onCheckedChange={() => toggleTheme()}
        activeActionIcon={<DarkIcon />}
        inactiveActionIcon={<LightIcon />}
        ariaLabel={isDarkMode ? t.switchToLight : t.switchToDark}
      />
    </div>
  );
}

function localeHref(pathname: string, locale: DocLocale): string {
  if (!/^\/docs\/(?:zh-CN|en-US)(?:\/|$)/.test(pathname)) {
    return `/docs/${locale}`;
  }

  return pathname.replace(/^\/docs\/(?:zh-CN|en-US)(?=\/|$)/, `/docs/${locale}`);
}

interface DocsHeaderProps {
  config?: DocsHeaderConfig;
  /** 传入时才显示语言切换器；旧的 Element Plus 页面尚未迁移 */
  locale?: DocLocale;
}

/**
 * 对应官方 docs 的顶栏：sticky 定位、毛玻璃背景、底部 1px 分隔线。
 */
export default function DocsHeader({
  config = ELEMENT_PLUS_HEADER,
  locale,
}: DocsHeaderProps) {
  const pathname = usePathname();
  const t = useDocsMessages();

  return (
    <header className="docs-header">
      <div className="docs-header__wrapper">
        <div className="docs-header__container">
          <div className="docs-header__logo">
            {config.logo.kind === "image" ? (
              <Link href={config.logo.href} aria-label={config.logo.alt}>
                <img src={config.logo.src} alt={config.logo.alt ?? ""} />
              </Link>
            ) : (
              <Link className="docs-header__logo-text" href={config.logo.href}>
                {config.logo.text}
              </Link>
            )}
            {config.badge && (
              <ElTag
                type="primary"
                size="small"
                round
                title={config.badge.title}
              >
                {config.badge.text}
              </ElTag>
            )}
          </div>

          <div className="docs-header__content">
            {config.links.map((item) => {
              const isActive = item.activePrefix
                ? pathname.startsWith(item.activePrefix)
                : pathname === item.href;
              const className = isActive
                ? "docs-header__link is-active"
                : "docs-header__link";

              if (item.external) {
                return (
                  <a
                    key={item.text}
                    className={className}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.text}
                  </a>
                );
              }

              return (
                <Link key={item.text} className={className} href={item.href}>
                  {item.text}
                </Link>
              );
            })}

            {locale && (
              <div
                className="docs-header__locale"
                role="group"
                aria-label={t.switchLanguage}
              >
                {DOC_LOCALES.map((item) => (
                  <Link
                    key={item}
                    href={localeHref(pathname, item)}
                    className={
                      item === locale
                        ? "docs-header__locale-link is-active"
                        : "docs-header__locale-link"
                    }
                    onClick={() => {
                      try {
                        localStorage.setItem("docs-locale", item);
                      } catch {
                        // 隐私模式下 localStorage 不可用，仅影响下次默认语言
                      }
                    }}
                  >
                    {LOCALE_LABELS[item]}
                  </Link>
                ))}
              </div>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
