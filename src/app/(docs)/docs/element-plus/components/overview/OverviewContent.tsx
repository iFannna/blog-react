"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "@/components/element-plus/icons/Search";
import { OVERVIEW_ICONS } from "@/components/element-plus/overview-icons";
import { Heading } from "../../../../_components/Heading";
import { DOC_NAV } from "../../../../_components/nav-config";
import type { DocNavItem } from "../../../../_components/nav-config";

const OVERVIEW_TITLE = "Overview 组件总览";

export function OverviewContent() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const groups = useMemo(() => {
    const keyword = query.trim().toLowerCase().replace(/-/g, " ");

    return DOC_NAV.filter((group) => group.title !== OVERVIEW_TITLE)
      .map((group) => ({
        ...group,
        items: keyword
          ? group.items.filter(
              (item) =>
                group.title.toLowerCase().includes(keyword) ||
                item.title.toLowerCase().includes(keyword),
            )
          : group.items,
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

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
              <OverviewCard item={item} key={item.slug} />
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

function OverviewCard({ item }: { item: DocNavItem }) {
  const Icon = OVERVIEW_ICONS[item.slug];
  const className = ["docs-overview-card", !item.done && "is-todo"]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="docs-overview-card-title">{item.title}</span>
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
      href={
        item.slug === "overview"
          ? "/docs/element-plus/components/overview"
          : `/docs/zh-CN/element-plus/components/${item.slug}`
      }
    >
      {content}
    </Link>
  );
}
