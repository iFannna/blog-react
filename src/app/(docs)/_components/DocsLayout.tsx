import type { ReactNode } from "react";
import DocsAside from "./DocsAside";
import DocsHeader from "./DocsHeader";
import { DocsI18nProvider } from "./DocsI18nProvider";
import DocsSidebar from "./DocsSidebar";
import type {
  DocLocale,
  DocsHeaderConfig,
  DocsNavGroup,
} from "@/lib/docs/types";

interface DocsLayoutProps {
  children: ReactNode;
  header: DocsHeaderConfig;
  nav: DocsNavGroup[];
  locale: DocLocale;
}

export default function DocsLayout({
  children,
  header,
  nav,
  locale,
}: DocsLayoutProps) {
  const shell = (
    <div className="docs-shell">
      <DocsHeader config={header} locale={locale} />
      <div className="docs-layout">
        <DocsSidebar groups={nav} />
        <main className="docs-content">{children}</main>
        <DocsAside />
      </div>
    </div>
  );

  return <DocsI18nProvider locale={locale}>{shell}</DocsI18nProvider>;
}
