import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/site-layout";
import Sidebar from "@/components/layout/sidebar";
import ArticleFeed from "@/components/article/article-feed";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { getArticles } from "@/services/article";
import { getCategories } from "@/services/category";
import { getTags } from "@/services/tag";
import type { Category, Tag } from "@/types/models";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { name } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  let categories: Category[] = [];
  let tags: Tag[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch (error) {
    console.error("Failed to fetch categories or tags:", error);
  }

  const category = categories.find((c) => c.name === decodeURIComponent(name));
  if (!category) {
    notFound();
  }

  let articlesData = { list: [] as import("@/types/models").Article[], total: 0 };
  try {
    articlesData = await getArticles({ page: currentPage, size: PAGE_SIZE, categoryId: category.id });
  } catch (error) {
    console.error("Failed to fetch articles by category:", error);
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);

  return (
    <SiteLayout
      showSidebar
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Category", path: "" },
          { name: category.name, path: "" },
        ]} />
      }
      sidebar={<Sidebar categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">分类: {category.name}</h1>
      <ArticleFeed
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={`/category/${name}`}
      />
    </SiteLayout>
  );
}
