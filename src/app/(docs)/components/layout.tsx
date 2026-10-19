import type { ReactNode } from "react";
import DocsAside from "./DocsAside";
import DocsHeader from "./DocsHeader";
import DocsSidebar from "./DocsSidebar";
import "./docs.css";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="docs-shell">
      <DocsHeader />
      <div className="docs-layout">
        <DocsSidebar />
        <main className="docs-content">{children}</main>
        <DocsAside />
      </div>
    </div>
  );
}
