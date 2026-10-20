"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "@/components/element-plus/icons/Search";
import { OVERVIEW_ICONS } from "@/components/element-plus/overview-icons";
import type { DocLocale } from "@/lib/docs/types";
import { Heading } from "./Heading";
import { DOC_NAV } from "./nav-config";
import type { DocNavItem } from "./nav-config";

const OVERVIEW_SLUG = "overview";

/** 导航数据的中文分组名带英文前缀，英文页面只保留官方用的英文部分 */
function getGroupTitle(title: string, locale: DocLocale): string {
  return locale === "zh-CN" ? title : title.split(" ")[0];
}

/** 中文页面用官方「英文 + 中文」标题，英文页面只保留英文 */
function getItemTitle(item: DocNavItem, locale: DocLocale): string {
  return locale === "zh-CN" ? (item.titleZh ?? item.title) : item.title;
}

export function OverviewContent({ locale }: { locale: DocLocale }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const groups = useMemo(() => {
    const keyword = query.trim().toLowerCase().replace(/-/g, " ");

    return DOC_NAV.filter((group) => group.items[0]?.slug !== OVERVIEW_SLUG)
      .map((group) => {
        const title = getGroupTitle(group.title, locale);

        return {
          title,
          items: keyword
            ? group.items.filter((item) => {
                const haystack = [item.title, item.titleZh]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();
                return (
                  title.toLowerCase().includes(keyword) ||
                  haystack.includes(keyword)
                );
              })
            : group.items,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [locale, query]);

  return (
    <div className="docs-overview">
      <div className="docs-overview-search">
        <Search className="docs-overview-search-icon" aria-hidden="true" />
        <input
          ref={searchRef}
          className="docs-overview-search-input"
          type="search"
          value={query}
          placeholder="Search Components"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {groups.map((group) => (
        <section className="docs-overview-group" key={group.title}>
          <div className="docs-overview-group-head">
            <Heading level={2}>{group.title}</Heading>
            <span className="docs-overview-count">{group.items.length}</span>
          </div>
          <div className="docs-overview-grid">
            {group.items.map((item) => (
              <OverviewCard item={item} locale={locale} key={item.slug} />
            ))}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="docs-overview-empty">No components found</p>
      )}
    </div>
  );
}

function OverviewCard({
  item,
  locale,
}: {
  item: DocNavItem;
  locale: DocLocale;
}) {
  const Icon = OVERVIEW_ICONS[item.slug];
  const className = ["docs-overview-card", !item.done && "is-todo"]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="docs-overview-card-title">
        {getItemTitle(item, locale)}
      </span>
      <span className="docs-overview-card-icon" aria-hidden="true">
        {Icon ? (
          <Icon />
        ) : (
          <span className="docs-overview-card-todo">Todo</span>
        )}
      </span>
    </>
  );

  if (!item.done) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      className={className}
      href={`/docs/${locale}/element-plus/components/${item.slug}`}
    >
      {content}
    </Link>
  );
}
