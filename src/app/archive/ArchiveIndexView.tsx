import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ArchiveTimeline from "@/components/ui/ArchiveTimeline";
import { getArticles } from "@/lib/api/article";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/ui";

const PAGE_SIZE = 50;
// 后端分页有上限，循环翻页直到拉完全部文章；MAX_PAGES 兜底防异常
const MAX_PAGES = 50;

interface MonthGroup {
  month: number;
  articles: Article[];
}
interface YearGroup {
  year: number;
  months: MonthGroup[];
  count: number;
}

// 循环翻页拉取全部已发布文章，total 取后端真实总数
async function fetchAllArticles(): Promise<{ list: Article[]; total: number }> {
  let list: Article[] = [];
  let total = 0;
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const data = await getArticles({ page, size: PAGE_SIZE });
      total = data.total;
      list = list.concat(data.list);
      if (data.list.length === 0 || list.length >= total) break;
    }
  } catch (error) {
    console.error("archive index: fetch articles failed", error);
  }
  return { list, total };
}

function groupByYearMonth(articles: Article[]): YearGroup[] {
  const byYear = new Map<number, Map<number, Article[]>>();
  for (const a of articles) {
    const { year, monthNumber } = formatDate(a.publishTime);
    let byMonth = byYear.get(year);
    if (!byMonth) {
      byMonth = new Map();
      byYear.set(year, byMonth);
    }
    let list = byMonth.get(monthNumber);
    if (!list) {
      list = [];
      byMonth.set(monthNumber, list);
    }
    list.push(a);
  }
  return [...byYear.keys()]
    .sort((x, y) => y - x)
    .map((year) => {
      const byMonth = byYear.get(year)!;
      const months: MonthGroup[] = [...byMonth.keys()]
        .sort((x, y) => y - x)
        .map((month) => ({
          month,
          articles: byMonth
            .get(month)!
            .slice()
            .sort((a, b) => +new Date(b.publishTime) - +new Date(a.publishTime)),
        }));
      return { year, months, count: months.reduce((s, m) => s + m.articles.length, 0) };
    });
}

export default async function ArchiveIndexView() {
  const { list: articles, total: totalCount } = await fetchAllArticles();
  const yearGroups = groupByYearMonth(articles);
  const latestMs = articles.reduce((m, a) => Math.max(m, +new Date(a.publishTime)), 0);
  const latest = latestMs ? formatDate(new Date(latestMs).toISOString()) : null;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "archive", path: "" },
  ];

  return (
    <SiteLayout
      breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
      youMayLikeArticles={articles.slice(0, 4)}
      featuredArticles={articles.slice(0, 3)}
      editorPickArticles={articles.slice(3, 6)}
    >
      <section className="archive-index">
        <header className="archive-header">
          <h1 className="page-heading-2">归档</h1>
          {totalCount > 0 && latest && (
            <p className="archive-header__meta">
              共 {totalCount} 篇 · 跨越 {yearGroups.length} 年 · 最近更新于 {latest.year} 年 {latest.monthNumber} 月 {latest.day} 日
            </p>
          )}
        </header>

        {totalCount === 0 ? (
          <div className="sidebar-widget archive-empty">
            <div className="sidebar-widget-title archive-empty__title">还没有内容</div>
            <p className="archive-empty__text">这个博客暂时没有可归档的文章。</p>
            <Link href="/" className="archive-empty__link">返回首页 →</Link>
          </div>
        ) : (
          <ArchiveTimeline yearGroups={yearGroups} />
        )}
      </section>
    </SiteLayout>
  );
}
