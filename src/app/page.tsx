import SiteLayout from "@/components/layout/site-layout";
import Sidebar from "@/components/layout/sidebar";
import ArticleFeed from "@/components/article/article-feed";
import { getArticles } from "@/services/article";
import { getCategories } from "@/services/category";
import { getTags } from "@/services/tag";
import type { Category, Tag } from "@/types/models";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  let articlesData: { list: import("@/types/models").Article[]; total: number };
  let categories: Category[] = [];
  let tags: Tag[] = [];

  try {
    [articlesData, categories, tags] = await Promise.all([
      getArticles({ page: currentPage, size: PAGE_SIZE }),
      getCategories(),
      getTags(),
    ]);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    articlesData = { list: [], total: 0 };
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);

  return (
    <SiteLayout
      showSidebar
      sidebar={<Sidebar categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">Blog</h1>
      <ArticleFeed
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </SiteLayout>
  );
}
