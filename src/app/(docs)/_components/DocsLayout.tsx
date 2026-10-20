import type { ReactNode } from "react";
import { DOC_NAV } from "./nav-config";
import DocsAside from "./DocsAside";
import DocsHeader from "./DocsHeader";
import { DocsI18nProvider } from "./DocsI18nProvider";
import DocsSidebar from "./DocsSidebar";
import "./docs.css";
import { ELEMENT_PLUS_HEADER } from "@/lib/docs/sections";
import type {
  DocLocale,
  DocsHeaderConfig,
  DocsNavGroup,
} from "@/lib/docs/types";

interface DocsLayoutProps {
  children: ReactNode;
  header?: DocsHeaderConfig;
  nav?: DocsNavGroup[];
  basePath?: string;
  locale?: DocLocale;
}

export default function DocsLayout({
  children,
  header = ELEMENT_PLUS_HEADER,
  nav = DOC_NAV,
  basePath = "/docs/zh-CN/element-plus/components",
  locale,
}: DocsLayoutProps) {
  const shell = (
    <div className="docs-shell">
      <DocsHeader config={header} locale={locale} />
      <div className="docs-layout">
        <DocsSidebar basePath={basePath} groups={nav} />
        <main className="docs-content">{children}</main>
        <DocsAside />
      </div>
    </div>
  );

  return locale ? (
    <DocsI18nProvider locale={locale}>{shell}</DocsI18nProvider>
  ) : (
    shell
  );
}
