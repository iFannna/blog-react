import SiteLayout from "@/components/blog/layout/site-layout";
import Sidebar from "@/components/blog/layout/sidebar";
import ArticleFeed from "@/components/blog/article/article-feed";
import { getArticles } from "@/services/article";
import { getCategories } from "@/services/category";
import { getTags } from "@/services/tag";
import type { Category, Tag } from "@/types/models";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
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
      locale={locale}
      showSidebar
      sidebar={<Sidebar locale={locale} categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">Blog</h1>
      <ArticleFeed
        locale={locale}
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </SiteLayout>
  );
}
