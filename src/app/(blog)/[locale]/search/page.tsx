import SiteLayout from "@/components/blog/layout/site-layout";
import Sidebar from "@/components/blog/layout/sidebar";
import ArticleFeed from "@/components/blog/article/article-feed";
import Breadcrumbs from "@/components/blog/common/breadcrumb";
import { localePath } from "@/lib/locale";
import { searchArticles } from "@/services/search";
import { getCategories } from "@/services/category";
import { getTags } from "@/services/tag";
import type { Category, Tag } from "@/types/models";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q: query, page: pageParam } = await searchParams;
  const keyword = query ? decodeURIComponent(query) : "";
  const currentPage = Number(pageParam) || 1;

  let categories: Category[] = [];
  let tags: Tag[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch (error) {
    console.error("Failed to fetch sidebar data:", error);
  }

  let articlesData = { list: [] as Awaited<ReturnType<typeof searchArticles>>["list"], total: 0 };
  if (keyword) {
    try {
      articlesData = await searchArticles({ q: keyword, page: currentPage, size: PAGE_SIZE });
    } catch (error) {
      console.error("Failed to search articles:", error);
    }
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);
  const basePath = keyword ? localePath(locale, `/search?q=${encodeURIComponent(keyword)}`) : localePath(locale, "/search");

  // 从搜索结果中提取 highlight 信息
  const highlightFields = Object.fromEntries(
    articlesData.list
      .filter((a) => a.highlightTitle || a.highlightSummary)
      .map((a) => [a.id, { title: a.highlightTitle, summary: a.highlightSummary }]),
  );

  const displayKeyword = keyword ? keyword.charAt(0).toUpperCase() + keyword.slice(1) : "";

  return (
    <SiteLayout
      locale={locale}
      showSidebar
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: localePath(locale, "/") },
          ...(keyword ? [{ name: "Search results", path: localePath(locale, `/search?q=${encodeURIComponent(keyword)}`) }, { name: displayKeyword, path: "" }] : []),
        ]} />
      }
      sidebar={<Sidebar locale={locale} categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">搜索: {keyword || "请输入关键词"}</h1>
      {!keyword ? (
        <p className="text-center py-20" style={{ color: "var(--color-text-secondary)" }}>
          请输入关键词进行搜索
        </p>
      ) : articlesData.list.length === 0 ? (
        <p className="text-center py-20" style={{ color: "var(--color-text-secondary)" }}>
          未找到与 &ldquo;{keyword}&rdquo; 相关的文章
        </p>
      ) : (
        <ArticleFeed
          locale={locale}
          articles={articlesData.list}
          totalPages={totalPages}
          currentPage={currentPage}
          basePath={basePath}
          highlightFields={highlightFields}
        />
      )}
    </SiteLayout>
  );
}
