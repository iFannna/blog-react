"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { articleHref } from "@/utils/article";
import { useLocale } from "@/hooks/locale";
import type { Article } from "@/types/models";

const MONTH_PAGE = 20;

interface MonthGroup {
  month: number;
  articles: Article[];
}
interface YearGroup {
  year: number;
  months: MonthGroup[];
  count: number;
}

export default function ArchiveTimeline({ yearGroups }: { yearGroups: YearGroup[] }) {
  const { prefix } = useLocale();
  const [openYears, setOpenYears] = useState<Set<number>>(
    () => new Set(yearGroups[0] ? [yearGroups[0].year] : []),
  );
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => {
    const latestYear = yearGroups[0];
    const latestMonth = latestYear?.months[0];
    return new Set(latestYear && latestMonth ? [`${latestYear.year}-${latestMonth.month}`] : []);
  });
  // 每月已渲染条数，滚动到底部自动追加，避免一次铺开全部文章
  const [visible, setVisible] = useState<Record<string, number>>({});
  const sentinels = useRef<Map<string, HTMLDivElement>>(new Map());

  const countOf = (key: string) => visible[key] ?? MONTH_PAGE;

  const toggleYear = (year: number) => {
    const willClose = openYears.has(year);
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
    if (willClose) {
      setOpenMonths((prev) => {
        const next = new Set(prev);
        next.forEach((k) => {
          if (k.startsWith(`${year}-`)) next.delete(k);
        });
        return next;
      });
    }
  };

  const toggleMonth = (key: string) => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 观察各展开月份底部的哨兵，进入视口则追加一页
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = { ...prev };
          let changed = false;
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const key = (entry.target as HTMLElement).dataset.key;
              if (key) {
                next[key] = (next[key] ?? MONTH_PAGE) + MONTH_PAGE;
                changed = true;
              }
            }
          }
          return changed ? next : prev;
        });
      },
      { rootMargin: "300px" },
    );
    sentinels.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [openMonths, openYears]);

  return (
    <div className="archive-accordion">
      {yearGroups.map((yg) => {
        const yearOpen = openYears.has(yg.year);
        return (
          <div key={yg.year} className={`archive-acc-year${yearOpen ? " is-open" : ""}`}>
            <span className="archive-year-watermark" aria-hidden="true">{yg.year}</span>

            <button
              type="button"
              className="archive-acc-year-head"
              onClick={() => toggleYear(yg.year)}
              aria-expanded={yearOpen}
            >
              <span className="archive-acc-year-num">{yg.year}</span>
              <span className="archive-acc-year-leader" />
              <span className="archive-acc-year-count">{yg.count} 篇</span>
              <span className="archive-acc-year-icon" aria-hidden="true" />
            </button>

            <div className="archive-acc-year-body">
              <div className="archive-acc-year-inner">
                {yg.months.map((mg) => {
                  const mm = String(mg.month).padStart(2, "0");
                  const key = `${yg.year}-${mg.month}`;
                  const monthOpen = openMonths.has(key);
                  const shown = countOf(key);
                  const hasMore = mg.articles.length > shown;
                  return (
                    <div key={mg.month} className={`archive-acc-month${monthOpen ? " is-open" : ""}`}>
                      <button
                        type="button"
                        className="archive-acc-month-head"
                        onClick={() => toggleMonth(key)}
                        aria-expanded={monthOpen}
                      >
                        <span className="archive-acc-month-label">{mm} 月</span>
                        <span className="archive-acc-month-leader" />
                        <span className="archive-acc-month-count">{mg.articles.length} 篇</span>
                        <span className="archive-acc-month-icon" aria-hidden="true" />
                      </button>

                      <div className="archive-acc-month-pane">
                        <div className="archive-acc-month-inner">
                          <ul className="archive-entries">
                            {mg.articles.slice(0, shown).map((a) => {
                              const monthNumber = a.month, day = a.day;
                              return (
                                <li key={a.id} className="archive-entry">
                                  <span className="archive-entry-date">
                                    {String(monthNumber).padStart(2, "0")}/{String(day).padStart(2, "0")}
                                  </span>
                                  <Link href={`${prefix}${articleHref(a)}`} className="archive-entry-title">
                                    {a.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                          {monthOpen && hasMore && (
                            <div
                              className="archive-loadmore"
                              data-key={key}
                              ref={(el) => {
                                if (el) sentinels.current.set(key, el);
                                else sentinels.current.delete(key);
                              }}
                            >
                              滚动加载更多…
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
