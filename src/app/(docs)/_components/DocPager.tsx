import Link from "next/link";
import { DOCS_MESSAGES } from "@/lib/docs/i18n";
import type { DocLocale, DocsNavItem } from "@/lib/docs/types";

interface DocPagerProps {
  locale: DocLocale;
  prev?: DocsNavItem;
  next?: DocsNavItem;
}

export default function DocPager({ locale, prev, next }: DocPagerProps) {
  if (!prev && !next) return null;

  const messages = DOCS_MESSAGES[locale];

  return (
    <nav className="docs-pager" aria-label={messages.pagerLabel}>
      {prev?.href ? (
        <Link
          className="docs-pager__link docs-pager__link--prev"
          href={prev.href}
        >
          <span className="docs-pager__label">{messages.previous}</span>
          <span className="docs-pager__title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next?.href ? (
        <Link
          className="docs-pager__link docs-pager__link--next"
          href={next.href}
        >
          <span className="docs-pager__label">{messages.next}</span>
          <span className="docs-pager__title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
