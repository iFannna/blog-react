import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import ArticleFeed from "@/components/ui/ArticleFeed";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { searchArticles } from "@/lib/api/search";
import { getCategories } from "@/lib/api/category";
import { getTags } from "@/lib/api/tag";
import type { Category, Tag } from "@/types/ui";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
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

  let articlesData = { list: [] as import("@/types/ui").Article[], total: 0 };
  if (keyword) {
    try {
      articlesData = await searchArticles({ q: keyword, page: currentPage, size: PAGE_SIZE });
    } catch (error) {
      console.error("Failed to search articles:", error);
    }
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);
  const basePath = keyword ? `/search?q=${encodeURIComponent(keyword)}` : "/search";

  return (
    <SiteLayout
      showSidebar
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          ...(keyword ? [{ name: "Search results", path: `/search?q=${encodeURIComponent(keyword)}` }, { name: keyword, path: "" }] : []),
        ]} />
      }
      sidebar={<Sidebar categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
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
          articles={articlesData.list}
          totalPages={totalPages}
          currentPage={currentPage}
          basePath={basePath}
        />
      )}
    </SiteLayout>
  );
}
