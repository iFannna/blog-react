import type { ReactNode } from "react";
import Aside from "./Aside";
import Header from "./Header";
import { I18nProvider } from "./I18nProvider";
import Sidebar from "./Sidebar";
import type {
  DocLocale,
  DocsHeaderConfig,
  DocsNavGroup,
} from "@/lib/docs/types";

interface LayoutProps {
  children: ReactNode;
  header: DocsHeaderConfig;
  nav: DocsNavGroup[];
  locale: DocLocale;
}

export default function Layout({
  children,
  header,
  nav,
  locale,
}: LayoutProps) {
  const shell = (
    <div className="docs-shell">
      <Header config={header} locale={locale} />
      <div className="docs-layout">
        <Sidebar groups={nav} />
        <main className="docs-content">{children}</main>
        <Aside />
      </div>
    </div>
  );

  return <I18nProvider locale={locale}>{shell}</I18nProvider>;
}
