import Link from "next/link";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ArrowLeft, ArrowRight } from "@/components/element-plus/icons";
import { DOCS_MESSAGES } from "@/lib/docs/i18n";
import type { DocLocale, DocsNavItem } from "@/lib/docs/types";

interface PagerProps {
  locale: DocLocale;
  prev?: DocsNavItem;
  next?: DocsNavItem;
}

export default function Pager({ locale, prev, next }: PagerProps) {
  if (!prev && !next) return null;

  const messages = DOCS_MESSAGES[locale];

  return (
    <nav className="docs-pager" aria-label={messages.pagerLabel}>
      <div className="docs-pager__prev">
        {prev?.href && (
          <Link className="docs-pager__link" href={prev.href}>
            <ElIcon className="docs-pager__icon">
              <ArrowLeft />
            </ElIcon>
            <span className="docs-pager__text">{prev.title}</span>
          </Link>
        )}
      </div>

      <div className="docs-pager__next">
        {next?.href && (
          <Link className="docs-pager__link" href={next.href}>
            <span className="docs-pager__text">{next.title}</span>
            <ElIcon className="docs-pager__icon">
              <ArrowRight />
            </ElIcon>
          </Link>
        )}
      </div>
    </nav>
  );
}
